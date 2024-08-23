import { type CommonTaskType } from './common.task.type'

export type ForecastTaskType = Partial<{
    appId: string
    id: string
    columnGrouped?: string
    posResulTableName?: string
    resultTable: string
    resultMetricTable?: string
    columnMeasure: string
    columnDate: string
    tableName: string
    databaseName: string
    freq?: string
    periods: number
}> &
    CommonTaskType
