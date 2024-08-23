import { exec } from 'child_process'
import { writeFileSync } from 'fs'
import { join } from 'path'
import type { SampleTaskType } from '@gaio/types'
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

export default async <T extends Partial<SampleTaskType>>(taskData: T) => {
    const autoPath = join(__dirname, '..', '..', '..', '..', 'coxph')
    await ensureDir(autoPath)

    await removeLocal([`${autoPath}/${taskData.id}*`])

    await dropTableIfExist(taskData)
    await generateTableResult(taskData)

    await createLocalData(taskData, autoPath)
    await createExecutable(taskData, autoPath)
    await runCoxph(taskData, autoPath)
    await csvUnion(taskData, autoPath)
    await importToBucket(taskData, autoPath)

    await removeLocal([`${autoPath}/${taskData.id}*`])

    return { status: 'done' }
}

const csvUnion = async (taskData, autoPath) => {
    await shell('union of results', 'gocsv', [
        'zip',
        `${autoPath}/${taskData.id}_in.csv`,
        `${autoPath}/${taskData.id}_out.csv`,
        '>',
        `${autoPath}/${taskData.id}_pre_result.csv`
    ])

    // await removeLocal([`${autoPath}/${taskData.id}_in.csv`, `${autoPath}/${taskData.id}_out.csv`]);

    await shell('remove header', 'gocsv', [
        'behead',
        `${autoPath}/${taskData.id}_pre_result.csv`,
        '>',
        `${autoPath}/${taskData.id}_result.csv`
    ])

    return await removeLocal([`${autoPath}/${taskData.id}_pre_result.csv`])
}

const runCoxph = async (taskData, autoPath) => {
    try {
        return await shell('run SA executable', 'python3', [`${autoPath}/${taskData.id}.py`])
    } catch (e) {
        throw { message: e.message }
    }
}

const generateTableResult = async (taskData) => {
    taskData.columns.unshift({
        ...taskData.columns[0],
        columnName: 'saPredict',
        dataType: 'Nullable(Float64)',
        columnLength: 4
    })

    await createTableAtBucket(
        taskData,
        generateClickhouseColumnTypes({
            ...taskData
        })
    )
}

const importToBucket = async (taskData, autoPath) => {
    const countCsvBeforeImport = await new Promise((resolve, reject) => {
        exec(`xsv count ${autoPath}/${taskData.id}_result.csv`, (error, stdout) => {
            if (error) {
                reject({
                    error: true,
                    code: 'import to bucket',
                    message: "can't count csv rows before upload to repository"
                })
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
            // '--input_format_csv_unquoted_null_literal_as_null=1',
            `--query='${query}'`,
            `<`,
            `${autoPath}/${taskData.id}_result.csv`
        ]

        await shell('import file with data to repository', `clickhouse-client`, [...clientArgs])

        await removeLocal([
            `${autoPath}/${taskData.id}_result.csv`
            // `${autoPath}/${taskData.id}.py`,
        ])

        return { status: 'done' }
    }
}

const createLocalData = async (taskData, autoPath) => {
    const before = `${autoPath}/${taskData.id}_out.csv`

    const query = `select * from ${taskData.databaseName}.${taskData.tableName}`
    const repo = await RepoModel.getRepoCredentials(taskData)
    const click = `clickhouse-client ${logComment(taskData)} --host=${repo.host} --user=${repo.user} --password=${
        repo.password
    } --query="${query} FORMAT CSVWithNames" > ${before}`
    await shell('export csv file', click, [])

    return { status: 'done' }
}

const createExecutable = async (taskData, autoPath) => {
    const pyFile = `${autoPath}/${taskData.id}.py`
    const inFile = `${autoPath}/${taskData.id}_in.csv`
    const outFile = `${autoPath}/${taskData.id}_out.csv`

    const startColumn = taskData.startColumn ? `start_column="${taskData.startColumn}",` : ''
    const ignore =
        taskData.excludeColumns.length <= 0 ? '' : `ignored_columns=['${taskData.excludeColumns.join("','")}'],`

    return writeFileSync(
        pyFile,
        [
            `import pandas as pd`,
            `import h2o`,
            `from h2o.estimators.coxph import H2OCoxProportionalHazardsEstimator`,
            `h2o.init()`,
            `data = pd.read_csv('${outFile}', sep=',')`,
            `data_h2o = h2o.H2OFrame(data)`,
            `train, valid = data_h2o.split_frame(ratios=[.7], seed=1234)`,
            `model = H2OCoxProportionalHazardsEstimator(
                ${startColumn}
                ${ignore}
                stop_column="${taskData.stopColumn}",
                ties="${taskData.ties}")`,
            `model.train(y="${taskData.eventColumn}",training_frame=train)`,
            `scoring = model.predict(data_h2o)`,
            `h2o.export_file(scoring, '${inFile}', force=True)`
        ].join('\n')
    )
}
