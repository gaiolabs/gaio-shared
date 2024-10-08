import { type CommonTaskType } from './common.task.type'
import type { FieldType } from '../core/field.type'

export type LocalFileTaskType = Partial<{
    schemaInference: string
    client: string
    newOracle: boolean
    truncateTables: string[]
    dropTables: string[]
    appId: string
    repoId: string
    resultTable: string
    resultDatabase: string
    databaseName: string
    insertMode: boolean
    folderPath: string
    fileFormatType: string
    deleteAfterImport: boolean
    columns: FieldType[]
}> &
    CommonTaskType
