import type { PositionType } from '../core/flow.type'

export type CommonTaskType = Partial<{
    id: string | null
    label: string | null
    appId: string
    repoId: string | null
    sourceType: 'source' | 'bucket' | 'super'
    sourceId: string | null
    codeSnippetId: string
    resultTable: string | null
    resultDatabase: string | null
    tableName: string | null
    databaseName: string | null
    client: string
    position: PositionType
    truncateTables: string[]
    dropTables: string[]
    schemaName: string | null
    clickhouse: boolean
    temporaryId: string
    shared: boolean
    created: boolean
    temporary: boolean
    admin?: unknown
    description?: string
}>
