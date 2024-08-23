import { writeFileSync } from 'fs'
import { join } from 'path'
import type { ForecastTaskType } from '@gaio/types'
import { getBucketNameFromAppId } from '@gaio/utils'
import { cloneDeep } from 'lodash-es'
import { RepoModel } from '../../../../../models'
import { shell } from '../runner.shell'
import {
    createTableAtBucket,
    dropTableIfExist,
    executeQuery,
    generateClickhouseColumnTypes,
    logComment,
    removeLocal
} from '../runner.tools'

export default async <T extends Partial<ForecastTaskType>>(taskData: T) => {
    const autoPath = join(__dirname, '..', '..', '..', '..', 'timeseries')

    await dropTableIfExist(taskData)
    await dropTableIfExist({ ...taskData, resultTable: 'pre_' + taskData.resultTable })

    let groups = []
    if (taskData.columnGrouped) {
        groups = ((await createClassification(taskData)) || []).map((o) => o.category)
    } else {
        groups = ['nd']
    }

    taskData.posResulTableName = cloneDeep(taskData.resultTable)
    taskData.resultTable = 'pre_' + taskData.resultTable

    await generateTableResult(taskData)

    for (const groupName of groups) {
        await createTimeseriesData(taskData, groupName, autoPath)
        await createExecutable(taskData, autoPath)
        await runTimeseries(taskData, autoPath)
        await prepareBeforeImportToRepo(taskData, groupName, autoPath)
        await importToBucket(taskData, autoPath)
    }

    await generateResultTable(taskData)

    let countGroupIndex = 0
    for (const groupName of groups) {
        if (taskData.resultMetricTable) {
            await createMetrics(taskData, groupName, countGroupIndex, autoPath)
        }

        countGroupIndex++
    }

    await removeLocal([`${autoPath}/${taskData.id}*`])

    return { status: 'done' }
}

const createMetrics = async (taskData, category, countGroupIndex, autoPath) => {
    const credentials = await RepoModel.getRepoCredentials(taskData)

    if (credentials) {
        const pyFile = `${autoPath}/${taskData.id}_metric.py`
        await removeLocal([pyFile])

        let body = `import clickhouse_connect\n`
        body += `db = clickhouse_connect.get_client(
                                                host='${credentials.host}', 
                                                username='app_${taskData.appId}', 
                                                password='${credentials.password}', 
                                                port=${credentials.port}, 
                                                database='bucket_${taskData.appId}')\n`

        let createTable = ''

        if (countGroupIndex <= 0) {
            createTable = [
                `db.command('DROP TABLE IF EXISTS ${taskData.resultMetricTable}')`,
                `db.command('CREATE TABLE IF NOT EXISTS ${taskData.resultMetricTable} (category Nullable(String), mse Nullable(Float64), mae Nullable(Float64), rmse Nullable(Float64),  r2 Nullable(Float64)) ENGINE MergeTree ORDER BY tuple()')`
            ].join('\n')
        }

        writeFileSync(
            pyFile,
            [
                `from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score`,
                `${body}`,
                `forecast_df = db.query_df("select * from ${taskData.posResulTableName} where real is not null and category = \'${category}\'")`,
                "y_true = forecast_df['real']",
                "y_pred = forecast_df['forecast']",
                'mse = mean_squared_error(y_true, y_pred)',
                'rmse = mean_squared_error(y_true, y_pred, squared=False)',
                'r2 = r2_score(y_true, y_pred)',
                'mae = mean_absolute_error(y_true, y_pred)',
                `category = '${category}'`,
                `${createTable}`,
                `db.insert('${taskData.resultMetricTable}', [[category,mse,mae,rmse,r2]], column_names=['category', 'mse', 'mae', 'rmse', 'r2'])`
            ].join('\n')
        )
        await shell('generate metrics', 'python3', [pyFile])
        await removeLocal([pyFile])
    }
}

const generateResultTable = async (taskData) => {
    let compareGroupColumn = ''
    if (taskData.columnGrouped) {
        compareGroupColumn = ` and p.category =  r.${taskData.columnGrouped}`
    }

    await executeQuery({
        at: taskData,
        sql: `CREATE TABLE  ${taskData.databaseName}.${taskData.posResulTableName} ENGINE MergeTree ORDER BY tuple() as 
            (select p.category, 
            p.ds as dt, r.${taskData.columnMeasure} as real,
            case
                when p.ds > (select max(${taskData.columnDate}) from ${taskData.databaseName}.${
                    taskData.tableName
                }) then 'forecast'
                else 'real'
                end as type,
             p.yhat as forecast, p.yhat_lower as lower, p.yhat_upper as upper
                from  ${getBucketNameFromAppId(taskData.appId)}.${taskData.resultTable} p
                left join ${taskData.databaseName}.${taskData.tableName} r 
                on p.ds = r.${taskData.columnDate} ${compareGroupColumn})`
    })

    await dropTableIfExist({ ...taskData })

    return { status: 'done' }
}

const runTimeseries = async (taskData, autoPath) => {
    try {
        return await shell('run timeseries executable', 'python3', [`${autoPath}/${taskData.id}.py`])
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
                    columnName: 'category',
                    dataType: 'Nullable(String)'
                },
                {
                    columnName: 'ds',
                    dataType: 'Nullable(Date)'
                },
                {
                    columnName: 'yhat',
                    dataType: 'Nullable(Float64)',
                    columnLength: 3
                },
                {
                    columnName: 'yhat_lower',
                    dataType: 'Nullable(Float64)',
                    columnLength: 3
                },
                {
                    columnName: 'yhat_upper',
                    dataType: 'Nullable(Float64)',
                    columnLength: 3
                }
            ]
        })
    )
}

const importToBucket = async (taskData, autoPath) => {
    const repoData = await RepoModel.getRepoCredentials(taskData)

    const query = `insert into ${getBucketNameFromAppId(taskData.appId)}.${taskData.resultTable} FORMAT TabSeparated`

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
        `${autoPath}/${taskData.id}_in.csv`
    ]

    await shell('import file with data to repository', `clickhouse-client`, [...clientArgs])
    return { status: 'done' }
}

const createTimeseriesData = async (taskData, groupName, autoPath) => {
    const columnGrouped = groupName === 'nd' ? '' : `AND ${taskData.columnGrouped} = '${groupName}'`

    const file = `${autoPath}/${taskData.id}_out.csv`
    await removeLocal([file])

    const query = `SELECT ${taskData.columnDate} as ds, ${taskData.columnMeasure} as y  
                            FROM ${taskData.databaseName}.${taskData.tableName}
                            WHERE ${taskData.columnDate} != '0000-00-00'
                            AND ${taskData.columnDate} is not null
                            ${columnGrouped}`

    const repo = await RepoModel.getRepoCredentials(taskData)
    const click = `clickhouse-client ${logComment(taskData)} --host=${repo.host} --user=${repo.user} --password=${
        repo.password
    } --query="${query} FORMAT CSVWithNames" | sed 's/\\\\\\N/''/g' | sed 's/NULL/''/g' > ${file}`

    await shell('export csv file', click, [])
}

const createClassification = async (taskData) => {
    const query = `SELECT ${taskData.columnGrouped} as category  
                                FROM ${taskData.databaseName}.${taskData.tableName}
                                WHERE ${taskData.columnDate} != '0000-00-00' 
                                    AND ${taskData.columnDate} is not null
                                    AND ${taskData.columnGrouped} != '' 
                                    AND ${taskData.columnGrouped} is not null
                                GROUP BY ${taskData.columnGrouped}`
    return await executeQuery({ at: taskData, sql: query })
}

const prepareBeforeImportToRepo = async (taskData, groupName, autoPath) => {
    const structure = [
        {
            columnName: 'ds',
            dataType: 'Nullable(Date)'
        },
        {
            columnName: 'yhat',
            dataType: 'Nullable(Float64)',
            columnLength: 3
        },
        {
            columnName: 'yhat_lower',
            dataType: 'Nullable(Float64)',
            columnLength: 3
        },
        {
            columnName: 'yhat_upper',
            dataType: 'Nullable(Float64)',
            columnLength: 3
        }
    ].map((o) => `${o.columnName} String`)

    const preInput = `${autoPath}/${taskData.id}_pre_in.csv`
    const inInput = `${autoPath}/${taskData.id}_in.csv`

    const localArgs = [
        '--input-format="CSVWithNames"',
        '--input_format_skip_unknown_fields=1',
        `--structure="${structure.join(',')}" `,
        `--query="select '${groupName}' as category, ds, yhat, yhat_lower, yhat_upper from table"`,
        `< ${preInput}`,
        `> ${inInput}`
    ]
    await shell('local treat data', `clickhouse-local`, [...localArgs])
}

const createExecutable = async (taskData, autoPath) => {
    const pyFile = `${autoPath}/${taskData.id}.py`
    // const metrics = `${autoPath}/${taskData.id}_metrics.py`
    const preInFile = `${autoPath}/${taskData.id}_pre_in.csv`
    const outFile = `${autoPath}/${taskData.id}_out.csv`

    await removeLocal([pyFile, preInFile])

    return writeFileSync(
        pyFile,
        [
            'import pandas as pd',
            'from prophet import Prophet',
            `df = pd.read_csv('${outFile}')`,
            'm = Prophet()',
            'm.fit(df)',
            `future = m.make_future_dataframe(freq='${taskData.freq || 'D'}', periods=${taskData.periods})`,
            'forecast = m.predict(future)',
            `forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].to_csv('${preInFile}', index=False)`
        ].join('\n')
    )
}
