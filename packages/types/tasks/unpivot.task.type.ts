import { type CommonTaskType } from './common.task.type'

export type UnpivotTaskType = Partial<{
    databaseName: string
    tableName: string
    resultDatabase: string
    resultTable: string
    extraColumns?: string[]
    extraColumnPosition?: 'start' | 'end'
    orderBy?: string
    orderByType?: 'ASC' | 'DESC'
    unpivotColumns: string[]
}> &
    CommonTaskType
