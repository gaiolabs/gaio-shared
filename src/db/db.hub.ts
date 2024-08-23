import type { CredentialsType } from '@gaio/types'
import mysql from 'mysql2/promise'
import { repoConnection } from './db.clickhouse'

export const dbHub = async (credentials: CredentialsType) => {
    switch (credentials.client) {
        case 'clickhouse':
            return repoConnection(credentials)
        case 'mysql':
            return mysql.createPool({
                host: credentials.host,
                port: Number(credentials.port),
                user: credentials.user,
                password: credentials.password,
                database: credentials.database,
                multipleStatements: true,
                supportBigNumbers: true,
                bigNumberStrings: false,
                dateStrings: true
            })
        default:
            throw new Error('Unknown client')
    }
}
