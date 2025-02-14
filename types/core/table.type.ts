import type { PositionType } from './flow.type'

export type TableType = Partial<{
    id: string
    type: 'table'
    appId: string
    label: string
    client: string
    repoId: string
    shared: boolean
    created: boolean
    position: PositionType
    sourceId: string
    tableName: string
    tableView: boolean
    temporary: boolean
    databaseName: string
    schemaName: string
    sourceType: string
}>
