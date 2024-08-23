import { exec } from 'child_process'
import { writeFileSync } from 'fs'
import { join } from 'path'
import type { AssociationRulesTaskType } from '@gaio/types'
import { getBucketNameFromAppId } from '@gaio/utils'
import { ensureDir } from 'fs-extra'
import { RepoModel } from '../../../../../models'
import { shell } from '../runner.shell'
import {
    createTableAtBucket,
    dropTableIfExist,
    generateClickhouseColumnTypes,
    logComment,
    removeLocal
} from '../runner.tools'

export default async <T extends AssociationRulesTaskType>(taskData: T) => {
    const autoPath = join(__dirname, '..', '..', '..', '..', 'basket')
    await ensureDir(autoPath)

    try {
        await removeLocal([`${autoPath}/${taskData.id}*`])

        await dropTableIfExist(taskData)
        await generateTableResult(taskData)

        await createLocalData(taskData, autoPath)
        await createExecutable(taskData, autoPath)
        await runBasket(taskData, autoPath)
        await importToBucket(taskData, autoPath)
        await removeLocal([`${autoPath}/${taskData.id}*`])
    } catch (e) {
        await removeLocal([`${autoPath}/${taskData.id}*`])
        throw e
    }

    return { status: 'done' }
}

const runBasket = async (taskData, autoPath) => {
    try {
        return await shell('run basket executable', 'python3', [`${autoPath}/${taskData.id}.py`])
    } catch (e) {
        throw { message: e.message }
    }
}

const generateTableResult = async (taskData) => {
    await createTableAtBucket(
        taskData,
        generateClickhouseColumnTypes({
            ...taskData,
            columns: [
                {
                    columnName: 'antecedents',
                    dataType: 'Nullable(String)'
                },
                {
                    columnName: 'consequents',
                    dataType: 'Nullable(String)'
                },
                {
                    columnName: 'antecedent_support',
                    dataType: 'Nullable(Float64)'
                },
                {
                    columnName: 'consequent_support',
                    dataType: 'Nullable(Float64)'
                },
                {
                    columnName: 'support',
                    dataType: 'Nullable(Float64)'
                },
                {
                    columnName: 'confidence',
                    dataType: 'Nullable(Float64)'
                },
                {
                    columnName: 'lift',
                    dataType: 'Nullable(Float64)'
                },
                {
                    columnName: 'leverage',
                    dataType: 'Nullable(Float64)'
                },
                {
                    columnName: 'conviction',
                    dataType: 'Nullable(Float64)'
                }
            ]
        })
    )
}

const importToBucket = async (taskData, autoPath) => {
    const countCsvBeforeImport = await new Promise((resolve, reject) => {
        exec(`xsv count ${autoPath}/${taskData.id}_in.csv`, (error, stdout) => {
            if (error) {
                reject({ message: "can't count csv rows before upload to repository" })
            }
            resolve({ count: `${stdout}`.replace(/\n/g, '').replace(/ /g, '') })
        })
    })

    if (countCsvBeforeImport && countCsvBeforeImport['count'] === '0') {
        return { status: 'done' }
    } else {
        const repoData = await RepoModel.getRepoCredentials(taskData)
        const query = `insert into ${getBucketNameFromAppId(taskData.appId)}.${taskData.resultTable} FORMAT CSV`
        const clientArgs = [
            `--host=${repoData.host}`,
            `--user=${repoData.user}`,
            `--password=${repoData.password} `,
            '--input_format_skip_unknown_fields=1',
            '--date_time_input_format="best_effort"',
            '--input_format_null_as_default=1',
            '--input_format_defaults_for_omitted_fields=1',
            '--input_format_tsv_empty_as_default=1',
            logComment(taskData),
            `--query='${query}'`,
            `<`,
            `${autoPath}/${taskData.id}_in.csv`
        ]

        await shell('import file with data to repository', `clickhouse-client`, [...clientArgs])

        const upquery = `alter table ${getBucketNameFromAppId(taskData.appId)}.${
            taskData.resultTable
        } update antecedents = replace( replace( replace(antecedents, 'frozenset({', ''), '})', '' ), '\\'', '' ) where antecedents is not null`
        const update = `clickhouse-client ${logComment(taskData)} --host=${repoData.host} --user=${
            repoData.user
        } --password=${repoData.password} --query="${upquery}"`

        await shell('update data frozenset', update, [])
        await shell('update data frozenset', update.replace(/antecedents/gi, 'consequents'), [])

        return { status: 'done' }
    }
}

const createLocalData = async (taskData: AssociationRulesTaskType, autoPath: string) => {
    const file = `${autoPath}/${taskData.id}_out.csv`
    await removeLocal([file])
    const before = `${autoPath}/${taskData.id}_out.csv`

    const query = `select ${taskData.columnCategory} as nr, ${taskData.columnReference} as pdt from ${taskData.databaseName}.${taskData.tableName}`
    const repo = await RepoModel.getRepoCredentials(taskData)
    const click = `clickhouse-client ${logComment(taskData)} --host=${repo.host} --user=${repo.user} --password=${
        repo.password
    } --query="${query} FORMAT TabSeparatedWithNames"  > ${before}`
    await shell('export csv file', click, [])

    return { status: 'done' }
}

const createExecutable = async (taskData, autoPath) => {
    const pyFile = `${autoPath}/${taskData.id}.py`
    const inFile = `${autoPath}/${taskData.id}_in.csv`
    const outFile = `${autoPath}/${taskData.id}_out.csv`

    return writeFileSync(
        pyFile,
        [
            `import pandas as pd`,
            `ds = pd.read_csv('${outFile}', sep='\\t', index_col=False)`,
            `from pycaret.arules import *`,
            `exp_arules = setup(ds, transaction_id = 'nr', item_id = 'pdt')`,
            `rules = create_model(metric='confidence', threshold=${taskData.minThreshold}, min_support = ${taskData.minSupport}, round = 4)`,
            `rules.iloc[:, :9].to_csv('${inFile}', index=False,sep=',', header=False)`
        ].join('\n')
    )
}
