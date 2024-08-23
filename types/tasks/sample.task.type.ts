import { type CommonTaskType } from './common.task.type'

export type SampleTaskType = Partial<{
    calcType: 'percent'
    calcValue: number | string
    databaseName: string
    tableName: string
    resultTable: string
}> &
    CommonTaskType
