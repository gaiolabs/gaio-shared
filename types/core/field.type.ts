export type FieldFormatType = Partial<{
    compactNumber?: boolean
    formatType?: string
    separators?: string
    formatDecimalSize?: number
    formatPrefix?: string
    columnLength?: number
    formatDate?: string
    formatSuffix?: string
}>

export type FieldStyleType = Partial<{
    fontWeight: string
    textAlign: string
    fontSize: number
    fontColor: string
    noHeaderStyle: boolean
    wordBreak: boolean
    whiteSpace: string
}>

export type FieldRuleOptionsType = Partial<{
    id: string
    operator: string
    reference: string
    extraReference?: string
    color: string
    icon: string
}>

export type FieldRuleType = Partial<{
    condType: string
    condColumnName: string
    condRules: FieldRuleOptionsType[]
}>

export type FieldType = Partial<{
    id: string
    type: string
    dataType: string
    pureType: string
    tableName: string
    columnName: string
    columnLength: any
    databaseName: string
    alias: string
    content: string
    computedId: string
    distinct: boolean
    isFunction: boolean
    order: string
    createOrderBy: boolean
    primaryKey: boolean
    operator: string
    valueType: string // can be value, parameter, computed,
    value: any
    extraValue: any
    groupDateBy: string

    [k: string]: any
}> &
    FieldFormatType &
    FieldStyleType &
    FieldRuleType
