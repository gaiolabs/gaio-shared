import { type CommonTaskType } from './common.task.type'

export type AssociationRulesTaskType = Partial<{
    minSupport: number
    resultTable: string
    databaseName: string
    minThreshold: number
    columnCategory: string
    columnReference: string
}> &
    CommonTaskType
