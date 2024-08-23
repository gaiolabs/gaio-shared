import { createClient, type ClickHouseSettings } from '@clickhouse/client-web'
import type { CredentialsType } from '@gaio/types'
import { RepoModel } from '../models'

const clickhouseSettings: ClickHouseSettings = {
    s3_truncate_on_insert: 1,
    format_csv_allow_single_quotes: 1,
    format_csv_allow_double_quotes: 1,
    allow_experimental_object_type: 1,
    async_insert: 1,
    wait_for_async_insert: 1,
    mutations_sync: '2',
    alter_sync: '2',
    enable_http_compression: 1,
    date_time_input_format: 'best_effort',
    join_use_nulls: 0,
    transform_null_in: 1,
    format_csv_null_representation: '',
    output_format_json_quote_64bit_integers: 0,
    wait_end_of_query: 1
}

export const dbClickhouse = (connectionData: Partial<CredentialsType>) => {
    const { host, port, user, password, ssl, database } = connectionData
    return createClient({
        url: ssl ? `http://${host}:${port}` : `http://${host}:${port}`,
        username: user,
        password: password,
        database: database || 'default',
        clickhouse_settings: clickhouseSettings
    })
}

export const repoConnection = (repoData: CredentialsType) => {
    return {
        query: async <T>(sql: string) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const query = sql
                        .replace(/^\s+|\s+$/g, '')
                        .toLowerCase()
                        .trim()

                    if (query.toLowerCase().trimStart().startsWith('select')) {
                        const resultSet = await dbClickhouse(repoData).query({
                            query: sql,
                            format: 'JSON',
                            clickhouse_settings: clickhouseSettings
                        })

                        const result = await resultSet.text()

                        if (result) {
                            try {
                                resolve(JSON.parse(result) as T)
                            } catch (e) {
                                reject({ command: 'error', message: e.message })
                            }
                        } else {
                            resolve([
                                {
                                    command: 'success'
                                }
                            ])
                        }
                    } else {
                        try {
                            await dbClickhouse(repoData)
                                .exec({
                                    query: sql,
                                    clickhouse_settings: clickhouseSettings
                                })
                                .then(() => resolve({ command: 'success' }))
                                .catch((e) => {
                                    reject({
                                        code: e.code,
                                        message: e.message,
                                        type: e.type
                                    })
                                })
                        } catch (e) {
                            reject({
                                code: e.code,
                                message: e.message,
                                type: e.type
                            })
                        }
                    }
                } catch (error) {
                    reject({
                        error: true,
                        message: error.message
                    })
                }
            })
        }
    }
}

/**
 * @desc Provide query for repo, using default credentials
 * @param repoId
 */
export const repositoryInstance = (repoId: string) => {
    return {
        query: async (sql: string) => {
            const repoData = await RepoModel.getRepoDataById(repoId)
            return new Promise(async (resolve, reject) => {
                try {
                    const query = sql
                        .replace(/^\s+|\s+$/g, '')
                        .toLowerCase()
                        .trim()

                    if (query.startsWith('select')) {
                        const resultSet = await dbClickhouse(repoData).query({
                            query: sql,
                            format: 'JSON',
                            clickhouse_settings: clickhouseSettings
                        })

                        const result = await resultSet.text()

                        if (result) {
                            try {
                                return resolve(JSON.parse(result))
                            } catch (e) {
                                return { command: 'error', message: e.message }
                            }
                        } else {
                            return resolve({ command: 'success' })
                        }
                    } else {
                        try {
                            await dbClickhouse(repoData).command({
                                query: sql,
                                clickhouse_settings: clickhouseSettings
                            })
                            resolve({ command: 'success' })
                        } catch (e) {
                            reject({
                                code: e.code,
                                message: e.message,
                                type: e.type
                            })
                        }
                    }
                } catch (error) {
                    reject({
                        error: true,
                        message: error.message
                    })
                }
            })
        },
        insert: async (tableName: string, data: unknown[]) => {
            const repoData = await RepoModel.getRepoDataById(repoId)

            return new Promise(async (resolve, reject) => {
                await dbClickhouse(repoData)
                    .insert({
                        table: tableName,
                        values: data,
                        format: 'JSONEachRow'
                    })
                    .then(() => {
                        resolve({ command: 'success' })
                    })
                    .catch((e) => {
                        reject({
                            code: e.code,
                            message: e.message,
                            type: e.type
                        })
                    })
            })
        }
    }
}
