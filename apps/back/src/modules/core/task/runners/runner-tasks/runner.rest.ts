import type { GenericType, ParamType, RestTaskType, TaskContextType } from '@gaio/types'
import { getBucketNameFromAppId } from '@gaio/utils'
import { snakeCase, deburr, trim, toNumber, isArray, isObject, at } from 'lodash-es'
import * as qs from 'qs'
import { RepoModel } from '../../../../../models'
import { fixBadDataAtJson } from '../../../../../utils'
import templateString from '../../../../../utils/templateString'
import { shell } from '../runner.shell'
import {
    createCsvFileFromAnArray,
    createTableAtBucket,
    dropTableIfExist,
    executeQuery,
    generateClickhouseColumnTypes,
    logComment,
    makeSureFolderExist,
    removeLocal,
    resourceFolder
} from '../runner.tools'

export default async <T extends Partial<RestTaskType>>(
    taskData: T,
    params: ParamType[],
    taskContext: TaskContextType
) => {
    console.log('taskData', params, taskContext)
    try {
        if (taskData.resultTableTruncate) {
            await dropTableIfExist(taskData)
        }

        if (taskData.tableName) {
            await listDataPaginated(taskData)
        } else {
            await requestExternal(taskData, {})
        }

        return { status: 'done:1' }
    } catch (e) {
        throw e
    }
}

const listDataPaginated = async (taskData, page = 0) => {
    let list = await executeQuery({
        at: taskData,
        sql: `select * from ${taskData.tableName} limit 100 offset ${page}`
    })

    if (list && list.length > 0) {
        for (const [i] of Object.entries(list)) {
            // const stopRunner = await this.config.getControlHelper(`app:${taskData.appId}`)
            // if (stopRunner === `app:${taskData.appId}:${this.requestOptions.userId}`) {
            //     break
            // }

            let obj = list[i]

            await this.requestExternal(taskData, obj)

            obj = null
            list[i] = null
        }

        list = null

        await new Promise((resolve) => setTimeout(resolve, 1))
        await this.listDataPaginated(taskData, page + 100)
    }
}

const requestExternal = async (taskData, sourceData) => {
    const { url, method } = taskData

    let hasUrlencoded = false

    for (const header of taskData.headers) {
        if (header.value && header.value.toLowerCase().includes('urlencoded')) {
            hasUrlencoded = true
        }
    }

    const headers = JSON.parse(
        prepareUrlByParameters(
            JSON.stringify(
                [...taskData.headers].reduce((acc, head) => {
                    const { prop, value } = head
                    return { ...acc, [prop]: value }
                }, {})
            ),
            sourceData
        )
    )

    if (!headers['Connection']) {
        headers['Connection'] = 'close'
    }

    let dataFromSource

    try {
        const abortController = new AbortController()
        const signal = abortController.signal

        const canSendBody = ['POST', 'PUT', 'PATCH'].includes(method)

        const response = await fetch(encodeURI(prepareUrlByParameters(url, sourceData)), {
            method: method,
            headers: headers,
            body:
                canSendBody ?
                    hasUrlencoded ? qs.stringify(JSON.parse(prepareUrlByParameters(taskData.body || '{}', sourceData)))
                    :   JSON.parse(prepareUrlByParameters(taskData.body || '{}', sourceData))
                :   null,
            signal: signal
        })

        if (!response.ok) {
            // throw new Error(`HTTP error! status: ${response.status}`)
            dataFromSource = null
            await saveLog(
                taskData,
                {
                    message: `HTTP error! status: ${response.status}`
                },
                'error',
                sourceData
            )
        } else {
            dataFromSource = await response.json()
            await saveResult(taskData, dataFromSource, sourceData)
            dataFromSource = null
            abortController.abort()
            return { status: 'done' }
        }
    } catch (e) {
        dataFromSource = null
        await saveLog(taskData, e.response ? e.response : e, 'error', sourceData)
    }

    return { status: 'done' }
}

const saveResult = async (taskData: RestTaskType, result, sourceData) => {
    const tablePrepared = false

    if (taskData.restType === 'sms') {
        await saveLog(taskData, result, 'success')
    } else {
        if (taskData.createTableType === 'mirror') {
            await prepareResult(taskData, tablePrepared)
        } else {
            await prepareFieldsBeforePrepareResult(taskData, result, tablePrepared)
        }

        if (taskData.resultTable && result) {
            const finalResult = retrieveDataEndpoint(taskData, result)

            const fields = taskData.resultTableFields.map((o) => o.columnName)
            // VALUES TO INSERT
            const prepareValues = (item) => {
                const valueFromRest = {}

                for (const [it, v] of Object.entries(item)) {
                    valueFromRest[nameFix(it)] = v
                }

                const values = []
                for (const fil of fields) {
                    values.push(valueFromRest[fil])
                }

                return values
            }
            // INSERT TASK ON TABLE RESULT
            const insert = (item) => {
                const values = {}
                const valueResults = prepareValues(item)
                for (const [i, v] of fields.entries()) {
                    values[v] =
                        isArray(valueResults[i]) || isObject(valueResults[i]) ?
                            JSON.stringify(valueResults[i])
                        :   valueResults[i]
                }

                // save wanted source data values
                if (taskData.tableName && taskData.transferSourceData && taskData.transferSourceData.length > 0) {
                    for (const sourceColumn of taskData.transferSourceData) {
                        values[sourceColumn] = sourceData[sourceColumn]
                    }
                }

                return values
            }

            // INSERT LIST OS ITEMS OR JUST A ITEM
            let baseToInsert = []

            if (isArray(finalResult)) {
                for (const item of finalResult) {
                    const data = !taskData.dontFixBadData ? fixBadDataAtJson(insert(item)) : insert(item)

                    baseToInsert.push(data)
                }
            } else {
                const data = !taskData.dontFixBadData ? fixBadDataAtJson(insert(finalResult)) : insert(finalResult)
                baseToInsert.push(data)
            }

            if (Array.isArray(baseToInsert) && baseToInsert.length > 0) {
                const folderOfTheInputCsvFile = resourceFolder() + '/' + taskData.appId

                makeSureFolderExist(folderOfTheInputCsvFile)

                try {
                    await createCsvFileFromAnArray(baseToInsert, folderOfTheInputCsvFile + '/' + taskData.id + '.csv')
                } catch (e) {
                    baseToInsert = null
                    throw e
                }

                baseToInsert = null

                const repoData = await RepoModel.getRepoCredentials(taskData)
                const query = `insert into ${getBucketNameFromAppId(taskData.appId)}.${
                    taskData.resultTable
                }  FORMAT CSVWithNames`

                const localArgs = [
                    folderOfTheInputCsvFile + '/' + taskData.id + '.csv',
                    '|',
                    'clickhouse-client',
                    `--host=${repoData.host}`,
                    `--user=${repoData.user}`,
                    `--password=${repoData.password} `,
                    '--format_csv_allow_single_quotes=1',
                    '--format_csv_allow_double_quotes=1',
                    '--date_time_input_format="best_effort"',
                    '--input_format_null_as_default=1',
                    '--input_format_defaults_for_omitted_fields=1',
                    '--input_format_skip_unknown_fields=1',
                    '--input_format_tsv_empty_as_default=1',
                    logComment(taskData),
                    `--query="${query}"`
                ]

                try {
                    await shell('pipe data and transfer to repository', `cat`, [...localArgs])
                    await removeLocal([folderOfTheInputCsvFile + '/' + taskData.id + '.csv'])
                } catch (e) {
                    await removeLocal([folderOfTheInputCsvFile + '/' + taskData.id + '.csv'])
                    throw e
                }
            }

            return { status: 'done:3' }
        }
    }

    return 'finished'
}

const prepareFieldsBeforePrepareResult = async (taskData: RestTaskType, result, tablePrepared) => {
    const finalResult = retrieveDataEndpoint(taskData, result)

    let sourceValues = {} as GenericType

    if (isArray(finalResult)) {
        sourceValues = finalResult[0] ? finalResult[0] : []
    } else {
        sourceValues = finalResult
    }

    const sourceFields = Object.keys(sourceValues)

    // make sure user does not inform mirror values
    taskData.resultTableFields = []

    const resultType = retrieveDataTypeEndpoint(taskData, result)

    for (let fil of sourceFields) {
        fil = nameFix(fil)
        let taskField
        if (resultType && isArray(resultType)) {
            taskField = resultType.find((o) => o.columnName && nameFix(o.columnName) === fil)
        }

        if (taskField && taskField.columnType) {
            taskData.resultTableFields.push({
                columnName: fil,
                dataType: taskField.dataType,
                index: taskField.index
            })
        } else if ((sourceValues[fil] && isArray(sourceValues[fil])) || isObject(sourceValues[fil])) {
            taskData.resultTableFields.push({
                dataType: 'Nullable(String)',
                columnLength: undefined,
                columnName: fil
            })
        } else if (sourceValues[fil] && !isNaN(toNumber(sourceValues[fil]))) {
            taskData.resultTableFields.push({
                dataType: 'Nullable(String)',
                columnLength: 4,
                columnName: fil
            })
        } else {
            taskData.resultTableFields.push({
                dataType: 'Nullable(String)',
                columnLength: undefined,
                columnName: fil
            })
        }
    }

    if (!taskData.resultTableFields.length) {
        result = null
    }

    await prepareResult(taskData, tablePrepared)

    return { message: 'done' }
}

const prepareResult = async (taskData: RestTaskType, tablePrepared) => {
    if (!tablePrepared) {
        tablePrepared = true
        if (taskData.resultTable && taskData.resultTable !== '' && taskData.resultTableFields.length > 0) {
            if (taskData.tableName) {
                // add source columns if it does not have on result configuration dynamic/mirror
                for (const sourceColumn of taskData.transferSourceData) {
                    if (!taskData.resultTableFields.some((o) => o.columnName === sourceColumn)) {
                        taskData.resultTableFields.push({
                            columnName: sourceColumn,
                            dataType: 'Nullable(String)',
                            columnLength: undefined,
                            sourceType: 'source'
                        })
                    }
                }
            }

            return await createTableAtBucket(
                taskData,
                generateClickhouseColumnTypes({
                    ...taskData,
                    columns: taskData.resultTableFields
                })
            )
        }
    }
    return 'success'
}

const saveLog = async (taskData: RestTaskType, res, type, sourceData = {}) => {
    if (taskData.keepLogTable && taskData.keepLogTable !== '') {
        let log: object | string

        if ((taskData.type === 'rest' && type === 'error') || (taskData.type !== 'rest' && type === 'success')) {
            const logTable = `log_${taskData.keepLogTable}`
            log = res.data || res

            const extraColumn =
                taskData.keepLogTableExtraColumn ? taskData.keepLogTableExtraColumn + ' Nullable(String),' : ''

            await executeQuery({
                at: taskData,
                sql: `
                        CREATE TABLE IF NOT EXISTS ${getBucketNameFromAppId(taskData.appId)}.${logTable} (
                                ${extraColumn} 
                                created_at Datetime DEFAULT now(),
                                type Nullable(String),
                                message Nullable(String)
                                ) 
                        engine = MergeTree
                        ORDER BY tuple()`
            })

            let message

            try {
                message = `${JSON.stringify(log)}`
            } catch (e) {
                if (typeof log === 'string') {
                    message = log
                } else {
                    message = 'Unknown'
                }
            }

            const fixBadChars = (str) => {
                return `${str}`
                    .replace(/\\t/g, ' ')
                    .replace(/\t/g, ' ')
                    .replace(/\\r/g, ' ')
                    .replace(/\r/g, ' ')
                    .replace(/\n/g, ' ')
                    .replace(/\\n/g, ' ')
                    .replace(/</g, '')
                    .replace(/>/g, '')
                    .replace(/"/g, ` `)
                    .replace(/'/g, ` `)
            }

            const columnNameToExtra = taskData.keepLogTableExtraColumn ? ` ${taskData.keepLogTableExtraColumn}` : ''
            const valueToExtra =
                taskData.keepLogTableExtraColumn ? `, '${sourceData[taskData.keepLogTableExtraColumn]}'` : ''

            const bucketName = getBucketNameFromAppId(taskData.appId)

            await executeQuery({
                at: taskData,
                sql: `insert into ${bucketName}.${logTable} (type, message, ${columnNameToExtra}) values ('${type}','${fixBadChars(
                    message
                )}' ${valueToExtra})`
            })

            if (taskData.keepLogDays) {
                await executeQuery({
                    at: taskData,
                    sql: `ALTER TABLE ${bucketName}.${logTable} DELETE WHERE created_at < subtractDays(now(), ${
                        Number(taskData.keepLogDays) || 2
                    })`
                })
            }
        } else {
            if (res) {
                return {
                    code: res.code || '',
                    message: res.message || res.msn || '',
                    status: res.status || '',
                    statusText: res.statusText || '',
                    data: res.data || ''
                }
            }
            return {
                status: 'error'
            }
        }
    }
}

const retrieveDataEndpoint = (taskData: RestTaskType, result) => {
    return taskData.resultTableProp ?
            at(result, [taskData.resultTableProp])[0] // navigate into object
        :   result
}

const retrieveDataTypeEndpoint = (taskData: RestTaskType, result) => {
    return taskData.resultDataTypeProp ?
            at(result, [taskData.resultDataTypeProp])[0] // navigate into object
        :   []
}

const prepareUrlByParameters = (findAndChangeString, sourceData) => {
    const params = []
    for (const key in sourceData) {
        if (sourceData.hasOwnProperty(key)) {
            params.push({
                paramName: key,
                paramValue: sourceData[key]
            })
        }
    }

    return templateString(findAndChangeString, params)
}

const nameFix = (name: string) => {
    return snakeCase(deburr(trim(name)))
}
