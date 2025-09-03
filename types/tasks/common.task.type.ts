import type { PositionType } from '../core/flow.type'

export type CommonTaskType = Partial<{
    id: string
    sharedId: string
    label: string
    appId: string
    repoId: string
    sourceType: string // 'source' | 'bucket' | 'super'
    sourceId: string
    paused: boolean
    toolOf: string
    parentOf: string
    stopped: boolean
    codeSnippetId: string
    resultTable: string
    resultDatabase: string
    tableName: string
    databaseName: string
    client: string
    position: PositionType
    truncateTables: string[]
    dropTables: string[]
    schemaName: string
    clickhouse: boolean
    temporaryId: string
    shared: boolean
    created: boolean
    temporary: boolean
    admin?: unknown
    description?: string
}>
