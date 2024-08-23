import type { CommonTaskType } from './common.task.type'
import type { FieldType } from '../core/field.type'

export type PcaTaskType = Partial<{
    excludeColumns: string[]
    imputeMissing: boolean
    columns: FieldType[]
    k: number
}> &
    CommonTaskType
