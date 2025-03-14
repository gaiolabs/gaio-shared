import { type CommonTaskType } from './common.task.type'
import { type SchemaType } from '../core/schema.type'

export type InsertTableTaskType = Partial<{
    type: 'insert'
    schema: SchemaType
    resultTable: string
    resultDatabase: string
}> &
    CommonTaskType
