import type { CommonTaskType } from './common.task.type'
import type { FieldType } from '../core/field.type'
import type { SchemaType } from '../core/schema.type'

export type InsertRowTaskType = Partial<{
    type: 'insertRow'
    columns: FieldType[]
    dropRow: boolean
    schema: SchemaType
    clearMutation: boolean
}> &
    CommonTaskType
