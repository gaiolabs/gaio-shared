import { type CommonTaskType } from './common.task.type'
import type { FieldType } from '../core/field.type'

export type QuickUploadTaskType = Partial<{
    type: 'quickUpload'
    saveReference: boolean
    dropTable: boolean
    transformData: boolean
    columns: FieldType[]
    lastItems: boolean
    data: { [key: string]: any }[]
}> &
    CommonTaskType
