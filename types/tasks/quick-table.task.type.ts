import { type CommonTaskType } from './common.task.type'
import type { FieldType } from '../core/field.type'

export type QuickTableTaskType = Partial<{
    dropTable: boolean
    columns: FieldType[]
    data: { [key: string]: any }[]
}> &
    CommonTaskType
