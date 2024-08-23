import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import * as qs from 'querystring'
import type { AutoMLTaskType, GenericType, TaskContextType } from '@gaio/types'
import { ensureDirSync } from 'fs-extra'
import { TaskTimer } from 'tasktimer'
import { shell } from '../runner.shell'
import { removeLocal } from '../runner.tools'

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

let projectName = ``
let summary = {} as GenericType
let autoPath = ''
const resources = join(__dirname, '..', '..', '..', '..', 'resources')

export default async <T extends AutoMLTaskType>(taskData: T, taskContext: TaskContextType) => {
    projectName = `auto${new Date().valueOf()}`
    // PREPARE
    await checkAutomlApi()

    await makeSureTrainFolderExist(taskData)
    await shell('remove old models', `rm -rf ${autoPath}/${taskData.appId}/${taskData.id}*`, [])
    await createTrainData(taskData)
    await deletePreviousFrames(taskData)
    return await startAutoml(taskData, taskContext)
}

const startAutoml = async (taskData, taskContext) => {
    try {
        const trainData = await importFile(taskData)
        const parseSetupData = await parseSetup(trainData)
        const parse = await parseFrame(parseSetupData)

        await followProgress(parse.job, taskData, 'AutomlSetup', taskContext)

        const builder = await automlBuilder({
            id: taskData.id,
            ...taskData.settings,
            destinationFrame: `${taskData.id}.hex`
        })

        await followProgress(builder.job, taskData, 'AutomlTrain', taskContext)

        return await saveModel(taskData)
    } catch (e) {
        throw {
            error: true,
            message: e.message || e.error || e
        }
    }
}

const saveModel = async (taskData) => {
    const { responseColumn } = taskData.settings

    try {
        const result = await rest.get(aml(`99/Leaderboards/${projectName}@@${responseColumn}`)).then((res) => res.data)

        const { models, table } = result

        if (models.length === 0) {
            return errorHandler({
                error: 'No model found. The problem could be related to contant value data for some columns. Verify it your response variable values are not constant.'
            })
        }

        const exportTo = `99/Models.bin/${models[0].name}?dir=${autoPath}/${taskData.id}&force=true`
        writeFileSync(`${autoPath}/${taskData.id}.json`, JSON.stringify(table))
        return await rest.get(aml(exportTo)).then((res) => res.data)
    } catch (error) {
        return errorHandler(error)
    }
}

// ## 1
const importFile = async (taskData) => {
    try {
        const imported = await rest
            .post(aml('3/ImportFiles'), {
                path: `${resources}/${taskData.id}.csv`
            })
            .then((res) => res.data)
        return imported.destination_frames
    } catch (error) {
        return errorHandler(error)
    }
}

// ## 2
const parseSetup = async (sourceFrames) => {
    try {
        return await rest
            .post(
                aml('3/ParseSetup'),
                qs.stringify({
                    source_frames: sourceFrames
                })
            )
            .then((res) => res.data)
    } catch (error) {
        return errorHandler(error)
    }
}

// ## 3
const parseFrame = async (parseData) => {
    try {
        return await rest
            .post(
                aml('3/Parse'),
                qs.stringify({
                    destination_frame: parseData.destination_frame,
                    source_frames: parseData.source_frames.map((o) => o.name),
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

// ## 4
const automlBuilder = async (automlBuilder) => {
    try {
        return await rest
            .post(aml('99/AutoMLBuilder'), {
                build_control: {
                    project_name: projectName, // automlBuilder.projectName,
                    // keep_cross_validation_predictions: true,
                    // keep_cross_validation_models: false,
                    // keep_cross_validation_fold_assignment: false,
                    stopping_criteria: {
                        seed: 7, // random(1, 9999999), //automlBuilder.seed,
                        max_models: 1000, // automlBuilder.maxModels || 30,
                        max_runtime_secs: automlBuilder.maxRuntimeSecs
                    }
                },
                build_models: {
                    exclude_algos: ['StackedEnsemble']
                    // algo_parameters: [
                    //     {
                    //         scope: 'GBM',
                    //         name: 'algo_full_name',
                    //         value: 'TRUE'
                    //         // GBM: { ignore_const_cols: true },
                    //         // ANOVAGLM: { ignore_const_cols: true },
                    //         // Aggregator: { ignore_const_cols: true },
                    //         // ClusteringModel: { ignore_const_cols: true }
                    //     }
                    // ]
                },
                input_spec: {
                    training_frame: automlBuilder.destinationFrame,
                    response_column: automlBuilder.responseColumn,
                    ignored_columns: automlBuilder.removeColumns,
                    sort_metric: 'AUTO'
                }
            })
            .then((res) => res.data)
    } catch (error) {
        return errorHandler(error)
    }
}

// PREPARATION
const deletePreviousFrames = async (taskData) => {
    if (summary.data && summary.data[1]) {
        for (const m of summary.data[1]) {
            if (m) {
                try {
                    await rest.delete(aml(`3/Models/${m}`))
                } catch (e) {
                    console.log('delete 0 ', e.message)
                }
            }
        }
    }
    try {
        await rest.delete(aml(`3/Frames/${taskData.id}.hex`))
    } catch (e) {
        console.log('delete 1', e.message)
    }

    try {
        await rest.delete(aml(`3/Frames/${taskData.id}`))
    } catch (e) {
        console.log('delete 2', e.message)
    }

    try {
        await rest.delete(aml(`3/Models/${taskData.id}.hex`))
    } catch (e) {
        console.log('delete 3', e.message)
    }

    try {
        await rest.delete(aml(`3/Frames/${taskData.id}.csv`))
    } catch (e) {
        console.log('delete 4', e.message)
    }

    // try {
    //     await rest.delete(aml(`3/Frames`));
    // } catch (e) {
    //     console.log(e.message);
    // }
    //
    // try {
    //     await rest.delete(aml(`3/Models`));
    // } catch (e) {
    //     console.log(e.message);
    // }

    try {
        await rest.delete(aml(`3/ModelMetrics/frames/${taskData.id}.hex/models/${taskData.id}.hex`))
    } catch (error) {
        return { ...error }
    }
}

// CHECK AUTOML ON
const checkAutomlApi = async () => {
    try {
        return await rest.get(aml(`3/About`)).then((res) => res.data)
    } catch (error) {
        throw { error: true, message: 'AutoML is offline' }
    }
}

// CREATE FOLDERS
const makeSureTrainFolderExist = async (taskData: AutoMLTaskType) => {
    autoPath = join(__dirname, '..', '..', '..', '..', 'models', `${taskData.appId}`)

    try {
        const textFile = readFileSync(`${autoPath}/${taskData.id}.json`).toString()
        summary = JSON.parse(textFile)
    } catch (error) {
        summary = {}
    }

    await removeLocal([`${autoPath}/${taskData.id}`, `${autoPath}/${taskData.id}.json`])

    return ensureDirSync(autoPath)
}

// PREPARATION - EXPORT HELPER
const createTrainData = async (taskData) => {
    const trainFile = `${resources}/${taskData.id}.csv`

    await removeLocal([trainFile])

    // const query = `SELECT * FROM ${taskData.databaseName}.${taskData.tableName} LIMIT ${taskData.limitRows || 100000}`

    // const readStream = db.stream(query)
    // const writeStream = createWriteStream(trainFile)
    //
    // let hasHeader = false
    // const tf = new Transform({
    //     objectMode: true,
    //     transform: (chunk, enc, cb) => {
    //         let row = ''
    //         if (!hasHeader) {
    //             hasHeader = true
    //             row = Object.keys(chunk).join('\t') + '\n'
    //         }
    //         row += Object.values(chunk).join('\t') + '\n'
    //         cb(null, row)
    //     }
    // })

    // const pipe = promisify(pipeline)
    //
    // await pipe(readStream, tf, writeStream)

    return { message: 'Success to export' }
}

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

const followProgress = async (job, taskData, type, taskContext) => {
    let progress: GenericType | { error: boolean; message: string } = {
        status: 'RUNNING',
        position: 0,
        error: false
    }

    return await new Promise((resolve, reject) => {
        if (job.key && job.key.name) {
            const timer = new TaskTimer(500)
            timer
                .add(async () => {
                    if (!progress.error) {
                        if (progress['status'] === 'RUNNING') {
                            progress = await followProgressHelper(job.key.name)
                            await sendMessageSocket(
                                {
                                    ...progress,
                                    job: job.key.name,
                                    id: taskData.id,
                                    type
                                },
                                taskContext
                            )
                        } else {
                            timer.stop()
                            resolve({ status: 'Done' })
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

const followProgressHelper = async (url) => {
    try {
        return await rest.get(aml('3/Jobs/' + url)).then((res) => {
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

const sendMessageSocket = async (progress, taskContext) => {
    // const { userId } = taskContext
    console.log(progress, taskContext)
    //
    // return {}

    // taskSocket.server.sockets.emit('job' + userId, {
    //     from: 'studio',
    //     ...progress,
    //     userId
    // })
}

const aml = (endpoint: string) => {
    return `${Bun.env.h2o_api}/${endpoint}`
}
