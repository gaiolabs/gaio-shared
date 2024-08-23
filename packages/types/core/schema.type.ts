import type { FieldType } from './field.type'

export type SchemaComputedType = {
    id?: string
    global?: boolean
    globalId?: string
    type?: string
    alias?: string
    content?: string
    dataType?: string
    columnLength?: string
    columnName?: string
    computedId?: string
}

export type SchemaJoinItemType = {
    id: string
    andOr: string
    operator: string
    tableBy: string
    tableTo: string
    databaseName: string | null
    tableName: string | null
    byDatabaseName: string
    toDatabaseName: string
    columnBy: string
    columnTo: string
    columnLength: any
    columnType: string | null
}

export type SchemaListType = Partial<{
    id: string
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
    columnLength: any
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
    SchemaComputedType

export type SchemaGroupType = FieldType[]
export type SchemaSelectType = Partial<{ targetColumn: string }> & FieldType[]

export type SchemaJoinType = {
    id: string
    by: string
    to: string
    raw: string | null
    list: SchemaJoinItemType[]
    type: string
    byDatabaseName: string
    toDatabaseName: string
    refs: SchemaJoinItemType[] | null
}

export type LimitByType = FieldType[]

export type SchemaType = Partial<{
    delete: boolean
    insert: any[]
    update: any[]
    select: SchemaSelectType
    join: SchemaJoinType[]
    group: SchemaGroupType
    sort: SchemaSortType[]
    filter: SchemaFilterType[]
    having: SchemaFilterType[]
    computed: SchemaComputedType[]
    limit: number | null
    offset: number | null
    limitBy: LimitByType
    with: unknown
}>
