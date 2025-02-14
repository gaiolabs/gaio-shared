import type { FieldType } from './field.type'

export type ComputedType = {
    id?: string
    global?: boolean
    globalId?: string
    type?: string
    alias?: string
    content?: string
    dataType?: string
    columnLength?: number
    columnName?: string
    computedId?: string
}

export type SchemaJoinItemType = {
    id: string
    andOr: string
    operator: string
    tableBy: string
    tableTo: string
    databaseName: string
    tableName: string
    byDatabaseName: string
    toDatabaseName: string
    columnBy: string
    columnTo: string
    columnLength: number
    columnType: string
}

export type SchemaListType = Partial<{
    id: string
    global?: boolean
    globalId?: string
    computedId?: string
    type: string
    andOr: string
    value: string
    dataType: string
    operator: string
    fieldType: string
    tableName: string
    valueType: string
    columnName: string
    extraValue: string
    columnLength: number
    databaseName: string
    selected: boolean
    applied: boolean
}>

export type SchemaFilterType = Partial<{
    list: SchemaListType[]
    andOr: string
    operator: string
}>

export type SchemaSortType = Partial<{
    id: string
    order: string
    tableName: string
    columnName: string
    databaseName: string
}> &
    ComputedType

export type SchemaGroupType = FieldType[]
export type SchemaSelectType = Partial<{ targetColumn: string }> & FieldType[]

export type SchemaJoinType = {
    id: string
    by: string
    to: string
    raw: string
    list: SchemaJoinItemType[]
    type: string
    byDatabaseName: string
    toDatabaseName: string
    refs: SchemaJoinItemType[]
}

export type LimitByType = FieldType[]

export type SchemaType = Partial<{
    selectAll: boolean
    delete: boolean
    insert: any[]
    update: any[]
    select: SchemaSelectType
    join: SchemaJoinType[]
    group: SchemaGroupType
    sort: SchemaSortType[]
    filter: SchemaFilterType[]
    having: SchemaFilterType[]
    computed: ComputedType[]
    limit: number
    offset: number
    limitBy: LimitByType
    with: unknown
}>
