import { spawn } from 'child_process'
import { statSync } from 'fs'
import type { BuilderTaskType, CommonTaskType, ParamType, TaskContextType } from '@gaio/types'
import { getBucketNameFromAppId } from '@gaio/utils'
import { RepoModel, SourceModel } from '../../../../../models'
import templateString from '../../../../../utils/templateString'
import { QueryBuilder } from '../../../builder/builder'
import { shell } from '../runner.shell'
import {
    createTableAtBucket,
    dropTableIfExist,
    generateClickhouseColumnTypes,
    logComment,
    makeSureFolderExist,
    removeLocal,
    resourceFolder,
    tableCanBeTemporary
} from '../runner.tools'
import { usqlQueryCommand } from '../runner.usql'

export default async <T extends Partial<BuilderTaskType>>(
    taskData: T,
    params: ParamType[],
    taskContext: TaskContextType
) => {
    try {
        await clearFiles(taskData)

        const { from, userId, sessionid } = taskContext

        if (tableCanBeTemporary(from)) {
            taskData.resultTable = `${taskData.resultTable}`.replace(/tmp_/g, `tmp_gaio${sessionid || userId}_`)
        }

        if (!taskData.insertMode) {
            await dropTableIfExist(taskData)
        }

        return await sourceExecutionHub(taskData, params)
    } catch (e) {
        await clearFiles(taskData)

        try {
            if (!taskData.schemaInference && taskData.onErrorCreateTable) {
                await createTableAtBucket(taskData, generateClickhouseColumnTypes(taskData as CommonTaskType))
            }
        } catch (e) {}

        if (e && e.message && typeof e.message === 'string' && e.message.includes('EOF')) {
            e.message = 'Error: EOF. Possible empty result'
        }
        throw e
    }
}

const sourceExecutionHub = async (taskData: BuilderTaskType, parameters: ParamType[]) => {
    const sourceCredentials = await SourceModel.getSourceById(taskData.sourceId)

    if (taskData.type === 'sourceRaw' && !sourceCredentials.canExecuteRaw) {
        throw { message: 'This source is not enabled to execute raw query' }
    }

    const folder = `${resourceFolder()}/${taskData.appId}`

    makeSureFolderExist(folder)

    const output = `${folder}/${taskData.id}.tsv`
    const csvInput = `${folder}/${taskData.id}.csv`
    const txtInput = `${folder}/${taskData.id}.txt`

    let sql
    if (taskData.type === 'builder') {
        sql = await new QueryBuilder().generate(taskData, parameters)
    } else if (taskData.type === 'sourceRaw') {
        sql = await templateString(taskData.query, parameters)
        if (taskData.client === 'salesforce') {
            try {
                return bringSalesForce(taskData, sql, output, csvInput, txtInput)
            } catch (e) {
                throw { message: e.message }
            }
        }
    } else {
        throw { message: 'Error on type of task' }
    }

    const query = await usqlQueryCommand(taskData.client, {
        sql,
        csvInput,
        output,
        rawValue: taskData.rawValue,
        ...sourceCredentials
    })

    if (Bun?.env?.NODE_ENV === 'development') {
        console.log('usql query', query)
    }

    await bringData(taskData, query, output, csvInput, txtInput)

    return { status: 'done' }
}

const bringSalesForce = async (taskData: BuilderTaskType, queryToExecuteOnSource, output, csvInput, txtInput) => {
    console.log('Salesforce', taskData, queryToExecuteOnSource, output, csvInput, txtInput)
    // const db = await dbService.connect({
    //     ...taskData,
    //     client: 'salesforce',
    //     sourceType: 'source'
    // })
    //
    // const data = []
    //
    // await new Promise(async (resolve, reject) => {
    //     let soql
    //     const out = createWriteStream(output)
    //     const getError = (err) => {
    //         reject({
    //             error: true,
    //             code: 'salesforce:error',
    //             message: err.message || err
    //         })
    //     }
    //
    //     if (taskData.maxFetch && Number(taskData.maxFetch) > 0) {
    //         soql = executeQuery( at: queryToExecuteOnSource, getError).run({
    //             autoFetch: true,
    //             maxFetch: Number(taskData.maxFetch)
    //         })
    //     } else {
    //         soql = db.conn.query(queryToExecuteOnSource)
    //     }
    //
    //     soql.on('error', getError)
    //
    //     const csvTransform = new Transform({
    //         writableObjectMode: true,
    //         transform(chunk, encoding, callback) {
    //             const row = Object.values(chunk).join(',')
    //             this.push(row + '\n')
    //             callback()
    //         }
    //     })
    //
    //     out.on('error', getError)
    //     csvTransform.on('error', getError)
    //
    //     soql.on('record', (record) => {
    //         const item = dotObject.dot(record)
    //         for (let key in item) {
    //             if (key && key.includes('attributes.')) {
    //                 delete item[key]
    //             } else {
    //                 const newKey = key.replace(/\./g, '_')
    //                 item[newKey] = item[key]
    //                 if (key.includes('.')) {
    //                     delete item[key]
    //                 }
    //             }
    //         }
    //         data.push(item)
    //     })
    //
    //     soql.on('end', () => {
    //         if (!data.length) {
    //             reject({
    //                 error: true,
    //                 code: 'salesforce:error',
    //                 message: 'No data to relate columns and insert data'
    //             })
    //         } else {
    //             const columns = taskData.schema.select.map((item) => item.columnName)
    //
    //             const header = columns.join(',') // Object.keys(data[0]).join(',');
    //
    //             out.write(header + '\n')
    //             data.forEach((obj) => {
    //                 csvTransform.write(obj)
    //             })
    //             csvTransform.end()
    //             csvTransform.pipe(out)
    //             csvTransform.on('finish', () => {
    //                 resolve({ status: 'ok' })
    //             })
    //         }
    //     })
    // }).catch((e) => {
    //     throw e
    // })
    //
    // if (data.length) {
    //     data.length = 0
    // } else {
    //     throw { message: 'No data to relate columns and insert data' }
    // }
    //
    // const queryToExecute = `cat ${output} | scrubcsv --replace-newlines --null '(?i)NULL' -q -d "," | sed "s/'/′/g" `
    //
    // return await treatData(taskData, output, csvInput, txtInput, ',', queryToExecute)
}

const bringData = async (taskData: BuilderTaskType, queryToExecuteOnSource, output, csvInput, txtInput) => {
    if (!taskData.bringData && taskData.type === 'sourceRaw') {
        await shell('Query execution on source raw, dont bring data, just execute query', queryToExecuteOnSource, [])
    } else {
        return await treatData(taskData, output, csvInput, txtInput, '|', queryToExecuteOnSource)
    }
}

const treatData = async (
    taskData: BuilderTaskType,
    output,
    csvInput,
    txtInput,
    delimiter,
    queryToExecuteOnSource = ''
) => {
    if (taskData.type === 'builder' || (taskData.bringData && taskData.type === 'sourceRaw')) {
        const repoData = await RepoModel.getRepoCredentials(taskData)

        let structure = []
        let fields = []

        if (taskData.schemaInference) {
            await shell('bring data with inference then treat data', queryToExecuteOnSource, ['>', csvInput])

            const { size: fileIsNotEmpty } = statSync(csvInput)

            if (!fileIsNotEmpty) {
                throw { message: 'No data to relate columns and insert data' }
            }

            const terminal = spawn(`gocsv describe ${csvInput}`, {
                detached: true,
                shell: true
            })

            const dt: string = await new Promise((resolve, reject) => {
                let values = ''
                terminal.stdout.on('data', (data) => {
                    values += Buffer.from(data)
                })

                terminal.on('exit', (code) => {
                    if (code === 0) {
                        resolve(values)
                    } else {
                        reject(`Can't read file to infer headers`)
                    }
                })

                terminal.on('error', (error) => {
                    reject(error)
                })
            })

            const types = dt
                .split('\n')
                .filter((o) => o.trim().startsWith('Type:'))
                .map((o) => o.trim().replace('Type: ', ''))

            fields = dt
                .split('Columns:')[2]
                .split('\n')
                .filter((o) => o)
                .map((o) => o.replace('Type: ', '').trim())
                .filter((o) => o.includes(':'))
                .map((o) => {
                    return o.split(':')[1].trim()
                })

            if (Array.isArray(types)) {
                if (types.length === 1) {
                    if (types[0] === 'null') {
                        throw { message: 'Source did not delivered data. Verify query, table or view.' }
                    }
                }
            }

            structure = fields.map((field) => {
                return `${field} String`
            })

            let columns = fields.map((field, index) => {
                let t: string
                if (taskData.fieldAsString) {
                    t = 'String'
                } else {
                    if (types[index] === 'string') {
                        t = 'String'
                    } else if (types[index] === 'int') {
                        t = 'Int64'
                    } else if (types[index] === 'float') {
                        t = 'Float64'
                    } else if (types[index] === 'date') {
                        t = 'String'
                    } else if (types[index] === 'datetime') {
                        t = 'DateTime'
                    } else {
                        t = 'String'
                    }
                }

                return {
                    columnName: field,
                    dataType: t,
                    columnLength: 2
                }
            })

            fields = fields.map((o, i) => {
                if (types[i] === 'date') {
                    return `((substring(if(empty(${o}), null, ${o}), 1, 10)))  as ${o}`
                } else if (types[i] === 'datetime') {
                    return `(substring(if(empty(${o}), null, ${o}), 1, 19)) as ${o}`
                }
                return o
            })

            if (taskData.client === 'oracle') {
                columns = columns.map((o) => {
                    return {
                        columnName: o.columnName.toUpperCase(),
                        dataType: o.dataType,
                        columnLength: o.columnLength
                    }
                })
            }

            await createTableAtBucket(
                taskData,
                generateClickhouseColumnTypes({ ...taskData, schema: null, columns } as CommonTaskType)
            )

            const query = `insert into ${getBucketNameFromAppId(taskData.appId)}.${taskData.resultTable}  FORMAT TSV`

            const localArgs = [
                '|',
                `clickhouse-local`,
                '--input-format="CSVWithNames"',
                `--structure="${structure.join(',')}"`,
                `--query="select ${fields.join(',')} from table"`,
                '|',
                'clickhouse-client',
                `--host=${repoData.host}`,
                `--user=${repoData.user}`,
                `--password=${repoData.password} `,
                `--database=bucket_${taskData.appId}`,
                '--format_csv_allow_single_quotes=1',
                logComment(taskData),
                '--format_csv_allow_double_quotes=1',
                '--date_time_input_format="best_effort"',
                '--input_format_null_as_default=1',
                '--input_format_defaults_for_omitted_fields=1',
                '--input_format_tsv_empty_as_default=1',
                `--query="${query}"`
            ]

            try {
                await shell('pipe data and transfer to clickhouse', `cat ${csvInput}`, [...localArgs])
            } catch (e) {
                if (statSync(csvInput).size === 0) {
                    await clearFiles(taskData)
                    throw {
                        message: 'File is empty. No data from the source. ' + e.message
                    }
                } else {
                    throw e
                }
            }
        } else {
            await createTableAtBucket(taskData, generateClickhouseColumnTypes(taskData as CommonTaskType))

            structure = taskData.schema.select.map((col) => {
                let fieldName = col.alias || col.columnName
                if (taskData.client === 'oracle') {
                    fieldName = fieldName.toLowerCase()
                }
                return fieldName + ' String'
            })

            fields = taskData.schema.select.map((col) => {
                let fieldName = col.alias || col.columnName
                if (taskData.client === 'oracle') {
                    fieldName = fieldName.toLowerCase()
                }

                if (col.dataType.includes('DateTime')) {
                    return `(substring(if(empty(${fieldName}), null, ${fieldName}), 1, 19)) as ${fieldName}`
                } else if (col.dataType.includes('Date')) {
                    return `((substring(if(empty(${fieldName}), null, ${fieldName}), 1, 10)))  as ${fieldName}`
                }

                if (taskData.client === 'oracle') {
                    return (col.alias || col.columnName).toLowerCase()
                }

                return col.alias || col.columnName
            })

            const query = `insert into ${getBucketNameFromAppId(taskData.appId)}.${taskData.resultTable}  FORMAT TSV`

            const localArgs = [
                '|',
                `clickhouse-local`,
                '--input-format="CSVWithNames"',
                `--structure="${structure.join(',')}"`,
                `--query="select ${fields.join(',')} from table"`,
                '|',
                'clickhouse-client',
                `--host=${repoData.host}`,
                `--user=${repoData.user}`,
                `--password=${repoData.password} `,
                `--database=bucket_${taskData.appId}`,
                logComment(taskData),
                '--format_csv_allow_single_quotes=1',
                '--date_time_input_format="best_effort"',
                '--input_format_null_as_default=1',
                '--input_format_defaults_for_omitted_fields=1',
                '--input_format_tsv_empty_as_default=1',
                `--query="${query}"`
            ]

            await shell('local treat data', queryToExecuteOnSource, [...localArgs])
        }
    }
    await clearFiles(taskData)
    return { status: 'done' }
}

const clearFiles = async (taskData: BuilderTaskType) => {
    return await removeLocal([
        `${resourceFolder()}/${taskData.appId}/${taskData.id}.tsv`,
        `${resourceFolder()}/${taskData.appId}/${taskData.id}.csv`,
        `${resourceFolder()}/${taskData.appId}/${taskData.id}.txt`,
        `${resourceFolder()}/${taskData.appId}/tmp_${taskData.id}.tsv`
    ])
}
