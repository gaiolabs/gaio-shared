import { type CommonTaskType } from './common.task.type'
import type { FieldType } from '../core/field.type'

export type PivotTaskType = Partial<{
    type: 'pivot'
    order: string
    columns: FieldType[]
    tableName: string
    extraFields: FieldType[]
    resultTable: string
    databaseName: string
    resultDatabase: string
    transposeColumn: string
    dynamicTranspose: boolean
    extraFieldsPosition: string
    transposeAggregator: string
    transposeColumnValue: string
    dynamicTransposeSnakeCase: boolean
}> &
    CommonTaskType
