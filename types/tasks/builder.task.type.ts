import { type SchemaType } from '../core/schema.type'
import type { PositionType } from '../core/flow.type'
import { type CommonTaskType } from './common.task.type'
import type { FieldType } from '../core/field.type'

export type BuilderTaskType = Partial<{
    label: string
    transformType: string
    repoId: string
    position: PositionType // assuming corresponding type for PositionZod
    columns: FieldType[]

    bucketClient: string
    databaseName: string
    optimize: boolean
    rawImport: boolean
    resultDatabase: string
    schema: SchemaType // assuming corresponding type for SchemaModelZod
    schemaName: string
    tableName: string
    tableView: boolean
    temporary: boolean

    schemaInference: string
    insertMode: boolean
    onErrorCreateTable: boolean
    resultTable: string
    appId: string
    id: string
    query: string
    type: 'builder' | 'sourceRaw'
    sourceId: string
    client: string
    fieldAsString: boolean
    bringData: boolean
    maxFetch: number
    rawValue: string
}> &
    CommonTaskType
