import { createClient } from '@clickhouse/client-web'
import type { ClickHouseSettings } from '@clickhouse/client-web'
import { isArray } from 'lodash-es'
import { throwError } from '../utils'

const clickhouseSettings: ClickHouseSettings = {
    s3_truncate_on_insert: 1,
    format_csv_allow_single_quotes: 1,
    format_csv_allow_double_quotes: 1,
    allow_experimental_object_type: 1,
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

export const dbGaio = (queryLabel?: string) => {
    const host = '4.246.224.69'
    const port = 8123
    const user = 'default'
    const database = 'gaioadmin'
    const password = 'togfogoslhegusllhjehgh'
    const ssl = false

    const client = createClient({
        compression: {
            response: true,
            request: true
        },
        url: ssl ? `https://${host}:${port}` : `http://${host}:${port}`,
        username: user,
        password: password,
        database: database || 'default',
        clickhouse_settings: clickhouseSettings
    })

    const ref = queryLabel || 'gaio:core'

    return {
        query: async <T>(
            sql: string,
            options: {
                params?: Record<string, unknown>
                parse?: string[]
            } = {}
        ): Promise<Array<T>[] | Array<T> | void> => {
            return await client
                .query({
                    query: sql,
                    format: 'JSONEachRow',
                    query_params: options.params
                })
                .then((res) => res.json<Array<T>>())
                .then((res) => {
                    if (res) {
                        if (options.parse && options.parse.length) {
                            if (isArray(res))
                                return res.map((r) => {
                                    options.parse.forEach((p) => {
                                        if (r[p]) {
                                            r[p] = JSON.parse(<string>r[p])
                                        }
                                    })
                                    return r
                                }) as Array<T>
                        }
                        return res as Array<T>
                    }
                    return [] as Array<T>
                })
                .catch((e) => {
                    throwError({ message: e.message, ref })
                })
        },
        insert: async (
            table: string,
            values: Record<string, unknown>[],
            ref?: string
        ): Promise<{ success: boolean }> => {
            return client
                .insert({
                    table,
                    values,
                    format: 'JSONEachRow'
                })
                .then(() => ({
                    success: true
                }))
                .catch((e) => {
                    throwError({ message: e.message, ref })
                }) as Promise<{ success: boolean }>
        },
        exec: async (
            sql: string,
            options?: {
                params?: Record<string, unknown>
                stringify?: string[]
                ref?: string
            }
        ) => {
            if (options) {
                for (const key in options?.params) {
                    if (options?.stringify && options?.stringify.includes(key)) {
                        options.params[key] = JSON.stringify(options.params[key])
                    }
                }
            }

            await client
                .exec({
                    query: sql,
                    query_params: options?.params,
                    clickhouse_settings: {
                        wait_end_of_query: 1
                    }
                })
                .catch((e) => {
                    throwError({ message: e.message, ref })
                })

            return { success: true }
        }
    }
}
