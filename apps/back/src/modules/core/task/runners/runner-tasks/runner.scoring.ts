import { join } from 'path'
import * as qs from 'querystring'
import type { GenericType, SampleTaskType } from '@gaio/types'
import { getBucketNameFromAppId } from '@gaio/utils'
import { ensureDirSync } from 'fs-extra'
import { chunk, deburr, get, snakeCase } from 'lodash-es'
import { TaskTimer } from 'tasktimer'
import { dbGaio } from '../../../../../db/db.gaio'
import { shell } from '../runner.shell'
import { createTableAtBucket, dropTableIfExist, executeQuery, logComment, tableCanBeTemporary } from '../runner.tools'

const rest = {
    get: async (url: string, headers = { 'Content-Type': 'application/json' }) => {
        const response = await fetch(url, { method: 'GET', headers })
        return await response.json()
    },
    post: async (url: string, body = {}, headers = { 'Content-Type': 'multipart/form-data' }) => {
        const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) })
        return await response.json()
    },
    delete: async (url: string, headers = { 'Content-Type': 'application/json' }) => {
        const response = await fetch(url, { method: 'DELETE', headers })
        return await response.json()
    }
}
let autoPath = ''
const resourcesPath = join(__dirname, '..', '..', '..', '..', 'resources')
const api = Bun.env.h2o_api

export default async <T extends Partial<SampleTaskType>>(taskData: T, taskContext) => {
    await dropTableIfExist(taskData)

    const model = await loadModel(taskData)
    return await runner(taskData, model, taskContext)
}

const runner = async (taskData, model, taskContext) => {
    switch (model.type) {
        case 'automl':
            return await processFromAutoml(taskData, model.context, taskContext)
        default:
            return await processFromQuery(taskData, model.context)
    }
}

// GET MODEL DATA
const loadModel = async (taskData) => {
    return dbGaio()
        .query(
            ` select modelRef, type
                     from models
                      where modelId = ${taskData.modelId} limit 1`,
            {
                params: {
                    modelId: taskData.modelId
                }
            }
        )
        .then((res) => {
            const model = res[0] || {}
            if (model.modelRef) {
                return {
                    type: model.type,
                    context: model.modelRef.replace(/"/g, '')
                }
            } else {
                return { type: 'sql', context: 'select 1 + 1' }
            }
        })
}

// FROM SQL
const processFromQuery = async (taskData, sql) => {
    return await executeQuery({
        at: taskData,
        sql: `CREATE TABLE ${getBucketNameFromAppId(taskData.appId)}.${taskData.resultTable} ${sql}`
    })
}

// 0. FROM AUTOML
const processFromAutoml = async (taskData, frame, taskContext) => {
    makeSureTrainFolderExist(taskData)
    await prepareData(taskData, taskContext) // # 0.0.0

    const model = await importModel(frame) // # 1

    await predictions(taskData, model) // # 2
    await rapids(taskData) // #  3

    // # 4
    const frameData = await listAlData(taskData, {
        offset: 0,
        rows: 1, // starts with one to be greater than columns, so it runs
        fields: [],
        columns: []
    })

    await createTableToAutoml(taskData, frameData) // # 5
    return insertData(taskData, frameData) // # 6
}

// # 0.0.0
const prepareData = async (taskData, taskContext) => {
    await createLocalData(taskData, taskContext) // 0.1

    const sourceFrames = await importFile(taskData) // 0.2
    const parseSetupData = await parseSetup(sourceFrames) // 0.3

    // 0.4
    const parse = await parseFrame({
        ...parseSetupData,
        destinationFrame: `${taskData.id}.hex`,
        sourceFrames
    })

    return await followProgress(parse.job)
}

// # 0.1.0 PREPARATION - EXPORT HELPER
const createLocalData = async (taskData, taskContext) => {
    const file = `${resourcesPath}/${taskData.id}.csv`

    // await removeSync(file);

    const credentials = await dbGaio()
        .query(
            `select r.credentials from repos r 
                            inner join apps a on a.repoId = r.repoId where a.appId = {appId: String}`,
            { params: { appId: taskData.appId } }
        )
        .then((res) => res[0].credentials)

    return await exportDataToCsv(file, taskData, credentials, taskContext)
}

// # 0.1.1
const exportDataToCsv = async (file, taskData, credentials, taskContext) => {
    const query = tmpTable(`SELECT * FROM ${taskData.databaseName}.${taskData.tableName}`, taskContext)

    const c = credentials

    // --input_format_csv_unquoted_null_literal_as_null=0

    const command = ` clickhouse-client --host=${c.host} --user=${
        c.user
    } --format_csv_allow_single_quotes=1 ${logComment(taskData)} --password=${
        c.password
    } --query="${query} FORMAT CSVWithNames"  | sed 's/\\\\\\N/''/g' | sed 's/NULL/''/g' > ${file}`

    return await shell('export csv to automl', command, [])
}

// # 0.2 import file from local to H2O
const importFile = async (taskData) => {
    try {
        const imported = await rest
            .post(h2o('ImportFiles'), {
                path: `${resourcesPath}/${taskData.id}.csv`
            })
            .then((res) => res.data)
        return imported.destination_frames
    } catch (error) {
        return errorHandler(error)
    }
}

// # 0.3 parse setup-base from h2o
const parseSetup = async (sourceFrames) => {
    try {
        return await rest
            .post(
                h2o('ParseSetup'),
                qs.stringify({
                    source_frames: sourceFrames
                })
            )
            .then((res) => res.data)
    } catch (error) {
        return errorHandler(error)
    }
}

// # 0.4 parse from h2o
const parseFrame = async (parseData) => {
    try {
        return await rest
            .post(
                h2o('Parse'),
                qs.stringify({
                    destination_frame: parseData.destinationFrame,
                    source_frames: parseData.sourceFrames,
                    parse_type: parseData.parse_type,
                    separator: parseData.separator,
                    number_columns: parseData.number_columns,
                    single_quotes: parseData.single_quotes,
                    column_names: parseData.column_names,
                    column_types: parseData.column_types,
                    check_header: parseData.check_header,
                    delete_on_done: true,
                    chunk_size: parseData.chunk_size
                })
            )
            .then((res) => res.data)
    } catch (error) {
        return errorHandler(error)
    }
}

// # 0.5.0
const followProgress = (job) => {
    let progress: GenericType | { error: boolean; message: string } = {
        status: 'RUNNING',
        position: 0,
        error: false
    }

    return new Promise((resolve, reject) => {
        if (job.key && job.key.name) {
            const timer = new TaskTimer(500)
            timer
                .add(async () => {
                    if (!progress.error) {
                        if (progress['status'] === 'RUNNING') {
                            progress = await followProgressHelper(job.key.name)
                        } else {
                            resolve({ status: 'Done' })
                            timer.stop()
                        }
                    } else {
                        reject(progress.error)
                        timer.stop()
                    }
                })
                .start()
        } else {
            reject({
                error: true,
                message: 'Cant determine job while train'
            })
        }
    })
}

// # 0.5.1
const followProgressHelper = async (url) => {
    try {
        return await rest.get(h2o('Jobs/' + url)).then((res) => {
            const jobResult = res.data
            const progressResult = {} as GenericType
            if (jobResult.jobs && jobResult.jobs[0]) {
                progressResult.status = jobResult.jobs[0].status
                progressResult.position = Math.trunc(jobResult.jobs[0].progress * 100)
            }
            return progressResult
        })
    } catch (error) {
        return { error: true, message: 'Can`t load job from automl' }
    }
}

// # 1 import saved model, make sure we always have it on h2o
const importModel = async (frame) => {
    return await rest
        .post(
            h2o('Models.bin/not_in_use', 99),
            qs.stringify({
                dir: `${autoPath}/${frame}`,
                force: true
            })
        )
        .then((res) => get(res.data, 'models[0].model_id.name'))
}

// # 2 LOAD PREDICT
const predictions = async (taskData, model) => {
    try {
        return await rest
            .post(h2o(`Predictions/models/${model}/frames/${taskData.id}.hex`), {
                predictions_frame: taskData.id
            })
            .then((res) => res.data)
    } catch (error) {
        return errorHandler(error)
    }
}

// # 3 PREDICT PREPARE COMBINED
const rapids = async (taskData) => {
    try {
        return await rest
            .post(
                h2o(`Rapids`, 99),
                qs.stringify({
                    ast: `(assign combined-${taskData.id} (cbind ${taskData.id} ${taskData.id}.hex))`
                })
            )
            .then((res) => res.data)
    } catch (error) {
        return errorHandler(error)
    }
}

// # 4 LIST RECURSIVELY
const listAlData = async (taskData, frameData) => {
    frameData = await listCombined(taskData, frameData)

    if (frameData.columns.length < frameData.rows) {
        return await listAlData(taskData, frameData)
    }

    return frameData
}

// # 4.1 LIST COMBINED DATA PREDICT + CSV
const listCombined = async (taskData, frameData) => {
    try {
        return await rest
            .post(h2o(`Frames/combined-${taskData.id}?row_offset=${frameData.offset}&row_count=1000`))
            .then((res) => {
                frameData.offset += 1000
                return {
                    offset: frameData.offset,
                    rows: get(res.data, 'frames[0].rows'),
                    fields: get(res.data, 'frames[0].columns'),
                    columns: frameData.columns.concat(prepareColumnData(get(res.data, 'frames[0].columns')))
                }
            })
    } catch (error) {
        return errorHandler(error)
    }
}

// # 4.2 ORGANIZE DATA FROM COLUMNS
const prepareColumnData = (columns) => {
    const result = []
    for (const [colIndex, col] of columns.entries()) {
        if (col.domain) {
            for (const [dtIndex, dt] of col.data.entries()) {
                result[dtIndex] = result[dtIndex] || []
                result[dtIndex][colIndex] = col.domain[dt] || ''
            }
        } else if (col.data) {
            for (const [dtIndex, dt] of col.data.entries()) {
                result[dtIndex] = result[dtIndex] || []
                result[dtIndex][colIndex] = dt || ''
            }
        } else if (col.string_data) {
            for (const [sdIndex, sd] of col.string_data.entries()) {
                result[sdIndex] = result[sdIndex] || []
                result[sdIndex][colIndex] = sd || ''
            }
        }
    }
    return result
}

// $ 5 CREATE TABLE FROM automl
const createTableToAutoml = async (taskData, frameData) => {
    const { fields } = frameData
    const generateColumnType = (col) => {
        if (['int', 'integer'].includes(col.type)) {
            return 'Nullable(Int64)'
        } else if (['double', 'real', 'Real', 'Decimal', 'decimal', 'Numeric', 'numeric'].includes(col.type)) {
            return 'Nullable(Float64)'
        } else if (['time'].includes(col.type)) {
            return "Nullable(DateTime64(3, 'UTC'))"
        } else {
            return 'Nullable(String)'
        }
    }

    const fieldNames = fields.map((col) => {
        const columnName = snakeCase(deburr(`${col.label}`)).trim()
        const columnType = generateColumnType(col)
        return `${columnName} ${columnType}`
    })

    return createTableAtBucket(taskData, {
        fieldTypes: fieldNames.toString()
    })
}

// # 6 INSERT
const insertData = async (taskData, frameData) => {
    const { columns, fields } = frameData

    const fieldNames = fields.map((col) => snakeCase(deburr(`${col.label}`)).trim())
    const newCols = chunk<Array<Array<GenericType>>>(columns, 500)

    for (const colList of newCols) {
        const toInsert = []
        for (const res of colList) {
            toInsert.push(`(${(res || []).map((o) => (o ? `'${o}'` : "''")).toString()})`)
        }
        if (toInsert.length > 0) {
            await executeQuery({
                at: taskData,
                sql: `
                        insert into
                             ${getBucketNameFromAppId(taskData.appId)}.${taskData.resultTable}
                             (${fieldNames.toString()})
                             values ${toInsert.join(',')}`
            })
        }
    }

    return { status: 'Success' }
}

// API HELPER
const h2o = (endpoint, path = 3) => {
    return `${api}/${path}/${endpoint}`
}

// CREATE FOLDER TO EXPORT/IMPORT CSV
const makeSureTrainFolderExist = (taskData) => {
    autoPath = join(__dirname, '..', '..', '..', '..', 'models', `${taskData.appId}`)
    return ensureDirSync(autoPath)
}

// ERROR HANDLER
const errorHandler = (error) => {
    if (error.response && error.response.data) {
        throw {
            error: true,
            message: error.response.data.msg || 'No error message'
        }
    } else if (error.error) {
        throw { error: error.error }
    } else {
        throw { error }
    }
}

const tmpTable = (query, taskContext) => {
    const { from, userId, sessionid } = taskContext

    if (tableCanBeTemporary(from)) {
        return `${query}`.replace(/tmp_/g, `tmp_gaio${sessionid || userId}_`)
    }

    return query
}
