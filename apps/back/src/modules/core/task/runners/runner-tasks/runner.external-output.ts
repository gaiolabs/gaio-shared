import { spawn } from 'child_process'
import { createReadStream } from 'fs'
import type { CredentialsType, ExternalOutputTaskType, ParamType } from '@gaio/types'
import * as jsforce from 'jsforce'
import { renderString } from 'nunjucks'
import { RepoModel, SourceModel } from '../../../../../models'
import { resourceFolder, makeSureFolderExist, removeLocal, executeQuery, logComment } from '../runner.tools'

export default async <T extends Partial<ExternalOutputTaskType>>(taskData: T, params: ParamType[]) => {
    if (taskData.client === 's3') {
        await exportToS3(taskData, params)
    } else if (taskData.client === 'sf' || taskData.client === 'salesforce') {
        const folder = `${resourceFolder()}/${taskData.appId}`
        const output = `${folder}/${taskData.id}.tsv`

        try {
            makeSureFolderExist(folder)
            await exportData(taskData, output)
            await bulkInsert(taskData, output)
            await removeLocal([output])
        } catch (e) {
            await removeLocal([output])
        }
    }

    return { status: 'done' }
}

const exportToS3 = async (taskData: ExternalOutputTaskType, params: ParamType[]) => {
    const credentials = await SourceModel.getSourceById(taskData.sourceId)
    const filePathWithParameters = renderString(taskData.filePath, params)

    const filePath = `${credentials.host}/${filePathWithParameters}`
        .replace(/\/\//g, '/')
        .replace('https:/', 'https://')

    await executeQuery({
        at: taskData,
        sql: `INSERT 
            INTO 
            FUNCTION 
            s3(
                '${filePath}', 
                '${credentials.accessKey}',
                '${credentials.secretKey}',
                'CSVWithNames'
            ) SELECT * FROM ${taskData.databaseName}.${taskData.tableName} settings s3_truncate_on_insert = 1`
    })
}

const bulkInsert = async (taskData: ExternalOutputTaskType, output: string) => {
    let sourceData

    try {
        sourceData = await SourceModel.getSourceById(taskData.sourceId)
    } catch (e) {
        throw { message: 'Error to get source credentials' }
    }

    const conn = new jsforce.Connection({
        loginUrl: sourceData.loginUrl
    })

    return await new Promise((resolve, reject) => {
        conn.login(sourceData.user, sourceData.password + sourceData.token, function (err) {
            if (err) {
                return reject(err)
            }

            const csvFileIn = createReadStream(output)

            conn.bulk.load(taskData.resultTable, taskData.operation, csvFileIn, function (err, rets) {
                if (err) {
                    reject(err)
                }

                if (rets) {
                    for (let i = 0; i < rets.length; i++) {
                        if (!rets[i].success) {
                            reject({
                                error: true,
                                code: 'salesforce:error',
                                message: '#' + (i + 1) + ' error occurred, message = ' + rets[i].errors.join(', ')
                            })
                        }
                    }
                    resolve({ status: ' done' })
                } else {
                    reject({ status: ' done', rets })
                }
            })
        })
    })
}

const exportData = async (taskData: ExternalOutputTaskType, output: string) => {
    let repoData: CredentialsType

    try {
        repoData = await RepoModel.getRepoCredentials(taskData)
    } catch (e) {
        throw { message: 'Error to get repo credentials' }
    }

    let separator = ''

    if (taskData.separator) {
        separator = `--format_csv_delimiter="${taskData.separator}"`
    }

    let except = ''

    if (taskData.excludeFields && taskData.excludeFields.length > 0) {
        except = ` EXCEPT (${taskData.excludeFields}) `
    }

    const query = `clickhouse-client ${logComment(taskData)} --host=${repoData.host} --user=${
        repoData.user
    } --password=${repoData.password} ${separator}  --query="SELECT * ${except} FROM ${taskData.databaseName}.${
        taskData.tableName
    } FORMAT CSVWithNames" | sed 's/\\\\N/null/g'  > ${output}`

    const shell = spawn(query, [], {
        shell: true,
        detached: false
    })

    let error = ''

    shell.stderr.on('data', (data) => {
        const err = Buffer.from(data)
        error += err.toString()
    })

    await new Promise((resolve, reject) => {
        shell.on('exit', async (code) => {
            if (code <= 0) {
                resolve({ message: 'Success to export' })
            } else {
                reject({
                    message: 'Error while exporting.' + error
                })
            }
        })
    })

    return { status: 'done' }
}
