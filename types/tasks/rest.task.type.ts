import { type CommonTaskType } from './common.task.type'
import type { FieldType } from '../core/field.type'

export type RestTaskType = Partial<{
    resultTableTruncate: boolean
    tableName: string
    url: string
    method: string
    timeout: number
    headers: { prop: string; value: string }[]
    basicUsername: string
    basicPassword: string
    body: string
    restType: string
    createTableType: string
    resultTable: string
    resultTableFields: FieldType[]
    dontFixBadData: boolean
    keepLogTable: string
    keepLogDays: number
    resultTableProp: string
    resultDataTypeProp: string
    keepLogTableExtraColumn: string
    transferSourceData: string[]
    repoId: string
    appId: string
    id: string
    isBatch: boolean
    isBatchSchema: boolean
    batchSize: boolean
    bodySchema: string
    type: 'rest'
}> &
    CommonTaskType
