import type { CommonTableType } from './common-table.type'

export type CredentialsType = Partial<{
    host: string
    password: string
    user: string
    port: number
    extraPort: number
    ssl: boolean
    database: string
    schemaName: string
    canExecuteRaw: boolean
    client: string
    accessKey: string
    secretKey: string
    bucketName: string
    loginUrl: string
    token: string
    sid: string
    schema: string
    serviceName: string
    oracleAlternativeDriver: boolean
    oracleCaseSensitive: boolean
    encrypt: boolean
    encryptSource: boolean
}>

export type SourceType = Partial<{
    sourceId: string
    repoId: string
    sourceName: string
    repoName: string
    sourceType: string
    client: string
    databaseName: string
    credentials: CredentialsType
}> &
    CommonTableType
