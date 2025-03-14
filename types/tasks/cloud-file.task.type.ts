import { type CommonTaskType } from './common.task.type'
import type { FieldType } from '../core/field.type'

type CloudStorageFileData = Partial<{
    id: string
    label: string
    lastModified: string
    filePath: string
    size: number
    children: CloudStorageFileData[]
}>

export type CloudFileType = Partial<{
    type: 'cloudStorage'
    fileFormatType: string
    schemaInference: boolean
    insertMode: boolean
    columns: FieldType[]
    fileData: CloudStorageFileData
}> &
    CommonTaskType
