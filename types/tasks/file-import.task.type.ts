import { type CommonTaskType } from './common.task.type'
import type { FieldType } from '../core/field.type'

export type FileImportTaskType = Partial<{
    resultTable: string
    from: string
    append: boolean
    splitFile: boolean
    fixEncoding: boolean
    localPreparation: boolean
    id: string
    appId: string
    fileName: string
    fullPath: string
    fieldsTerminatedBy: string
    columns: FieldType[]
    transformFirst: boolean
    databaseName: string
}> &
    CommonTaskType
