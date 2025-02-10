import type { PositionType } from './flow.type'

export type TableType = Partial<{
    id: string | null
    type: 'table'
    appId: string
    label: string
    client: string
    repoId: string
    shared: boolean
    created: boolean | null
    position: PositionType | null
    sourceId: string | null
    tableName: string | null
    tableView: boolean
    temporary: boolean
    databaseName: string | null
    schemaName: string | null
    sourceType: string
}>
