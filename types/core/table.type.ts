import type { PositionType } from './flow.type'

export type TableType = Partial<{
    id: string | null
    type: string
    appId: string
    label: string
    client: string
    repoId: string
    shared: boolean
    created: boolean | null
    position: PositionType | null
    sourceId: number | null
    tableName: string | null
    tableView: boolean
    temporary: boolean
    sourceType: string
    databaseName: string | null
}>
