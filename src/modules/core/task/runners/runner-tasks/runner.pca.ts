import { exec } from 'child_process'
import { writeFileSync } from 'fs'
import { join } from 'path'
import type { PcaTaskType } from '@gaio/types'
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

export default async <T extends PcaTaskType>(taskData: T) => {
    const autoPath = join(__dirname, '..', '..', '..', '..', 'pca')

    await ensureDir(autoPath)

    await removeLocal([`${autoPath}/${taskData.id}*`])

    await dropTableIfExist(taskData)
    await generateTableResult(taskData)

    await createLocalData(taskData, autoPath)
    await createExecutable(taskData, autoPath)
    await runPca(taskData, autoPath)
    await csvUnion(taskData, autoPath)
    await importToBucket(taskData, autoPath)

    await removeLocal([`${autoPath}/${taskData.id}*`])

    return { status: 'done' }
}

const csvUnion = async (taskData: PcaTaskType, autoPath: string) => {
    await shell('union of results', 'gocsv', [
        'zip',
        `${autoPath}/${taskData.id}_in.csv`,
        `${autoPath}/${taskData.id}_out.csv`,
        '>',
        `${autoPath}/${taskData.id}_pre_result.csv`
    ])

    await shell('remove header', 'gocsv', [
        'behead',
        `${autoPath}/${taskData.id}_pre_result.csv`,
        '>',
        `${autoPath}/${taskData.id}_result.csv`
    ])

    return await removeLocal([`${autoPath}/${taskData.id}_pre_result.csv`])
}

const runPca = async (taskData: PcaTaskType, autoPath: string) => {
    try {
        return await shell('run pca executable', 'python3', [`${autoPath}/${taskData.id}.py`])
    } catch (e) {
        throw { message: e.message }
    }
}

const generateTableResult = async (taskData: PcaTaskType) => {
    const pcas = []
    for (let i = 0; i < taskData.k; i++) {
        pcas.push({
            ...taskData.columns[0],
            columnName: `pc_${i + 1}`,
            dataType: 'Nullable(Float64)',
            columnLength: 4
        })
    }

    taskData.columns = [...pcas, ...taskData.columns]

    await createTableAtBucket(
        taskData,
        generateClickhouseColumnTypes({
            ...taskData
        })
    )
}

const importToBucket = async (taskData: PcaTaskType, autoPath: string) => {
    const countCsvBeforeImport = await new Promise<{ message?: string; count?: string }>((resolve, reject) => {
        exec(`xsv count ${autoPath}/${taskData.id}_result.csv`, (error, stdout) => {
            if (error) {
                reject({ message: "can't count csv rows before upload to repository" })
            }
            resolve({ count: `${stdout}`.replace(/\n/g, '').replace(/ /g, '') })
        })
    })

    if (countCsvBeforeImport && countCsvBeforeImport.count === '0') {
        return { status: 'done' }
    }
    const repoData = await RepoModel.getRepoCredentials(taskData)
    const query = `insert into ${getBucketNameFromAppId(taskData.appId)}.${taskData.resultTable} FORMAT CSV`
    const clientArgs = [
        `--host=${repoData.host}`,
        `--user=${repoData.user}`,
        `--password=${repoData.password} `,
        '--input_format_skip_unknown_fields=1',
        '--format_csv_allow_single_quotes=1',
        '--format_csv_allow_double_quotes=1',
        '--date_time_input_format="best_effort"',
        '--input_format_null_as_default=1',
        '--input_format_defaults_for_omitted_fields=1',
        '--input_format_tsv_empty_as_default=1',
        logComment(taskData),
        `--query='${query}'`,
        `<`,
        `${autoPath}/${taskData.id}_result.csv`
    ]

    await shell('import file with data to repository', `clickhouse-client`, [...clientArgs])

    await removeLocal([`${autoPath}/${taskData.id}_result.csv`, `${autoPath}/${taskData.id}.py`])

    return { status: 'done' }
}

const createLocalData = async (taskData: PcaTaskType, autoPath: string) => {
    const before = `${autoPath}/${taskData.id}_out.csv`

    const query = `select * from ${taskData.databaseName}.${taskData.tableName}`
    const repo = await RepoModel.getRepoCredentials(taskData)
    const click = `clickhouse-client ${logComment(taskData)} --host=${repo.host} --user=${repo.user} --password=${
        repo.password
    } --query="${query} FORMAT CSVWithNames" > ${before}`
    await shell('export csv file', click, [])

    return { status: 'done' }
}

const createExecutable = async (taskData: PcaTaskType, autoPath: string) => {
    const pyFile = `${autoPath}/${taskData.id}.py`
    const inFile = `${autoPath}/${taskData.id}_in.csv`
    const outFile = `${autoPath}/${taskData.id}_out.csv`
    const ignore =
        taskData.excludeColumns.length <= 0 ? '' : `ignored_columns=['${taskData.excludeColumns.join("','")}'],`

    return writeFileSync(
        pyFile,
        `
import pandas as pd
import h2o
from h2o.estimators import H2OPrincipalComponentAnalysisEstimator
h2o.init()

data = pd.read_csv('${outFile}', sep=',')
data_h2o = h2o.H2OFrame(data)
train, valid = data_h2o.split_frame(ratios=[.7], seed=1234)

model = H2OPrincipalComponentAnalysisEstimator(
k = ${Number(taskData.k || 5)},
use_all_factor_levels = True,
${ignore}
pca_method = "glrm",
seed = 1234,
transform = "standardize",
impute_missing = ${taskData.imputeMissing ? 'True' : 'False'}
)

model.train(
   training_frame = train
)

scoring = model.predict(data_h2o)
h2o.export_file(scoring, '${inFile}', force=True)
`
    )
}
