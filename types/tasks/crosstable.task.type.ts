import type { CommonTaskType } from './common.task.type'
import type { FieldType } from '../core/field.type'

export type CrosstableTaskType = Partial<{
    type: 'crosstable'
    description: string
    columns: FieldType[]
    rows: FieldType[]
    values: FieldType[]
}> &
    CommonTaskType
