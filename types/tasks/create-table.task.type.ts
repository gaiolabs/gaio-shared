import type { FieldType } from '../core/field.type'
import { type CommonTaskType } from './common.task.type'

export type CreateTableTaskType = Partial<{
    columns: FieldType[]
    dropTable: boolean
}> &
    CommonTaskType