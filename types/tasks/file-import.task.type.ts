import { FieldType } from '../core/field.type'
import { type CommonTaskType } from './common.task.type'

export type FileImportSymbols = {
    comma: string
    crNewLine: string
    crlfNewLine: string
    doubleQuotes: string
    lfNewLine: string
    newLine: string
    none: string
    pipe: string
    semicolon: string
    singleQuotes: string
    tab: string
    custom: string
}

export type FileImportTaskType = Partial<{
    type: 'fileImport'
    resultTable: string
    from: string
    transformType: string
    append: boolean
    splitFile: boolean
    fixEncoding: string
    fullPath: string
    localPreparation: boolean
    id: string
    appId: string
    fileName: string
    fieldsTerminatedBy: keyof FileImportSymbols
    fieldsTerminatedByCustom: string
    columns: FieldType[]
    transformFirst: boolean
    databaseName: string
}> &
    CommonTaskType
