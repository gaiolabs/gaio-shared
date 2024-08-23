import type { CommonTableType } from './common-table.type'
import type { FieldType } from './field.type'
import type { CommonTaskType } from '../tasks/common.task.type'
import { GenericType } from '../generic.type'

export type MetaTypeOptions = Partial<{
    insights: {
        dimension?: string[]
        type: 'field' | 'computed'
        list?: Array<{
            left: string
            operator: '/' | '*' | '='
            right: string
            label?: string
        }>
        measure?: string[]
        date?: string[]
    }
    period?: 'daily' | 'weekly' | 'monthly'
    numberFormat: Partial<{
        formatDecimalSize: number
        separators: string
        formatType: string
        formatPrefix: string
        formatSuffix: string
    }>
    percentFormat: Partial<{
        formatDecimalSize: number
        separators: string
        formatType: string
        formatPrefix: string
        formatSuffix: string
    }>
    inverted: boolean
    schedule?: boolean
    cron?: string
    id?: string
    appId?: string
    label?: string
    growthPercentage: number
}> &
    GenericType

export type MetaType = Partial<{
    id: string
    metaId: string
    label: string
    tableName: string
    databaseName: string
    fields: FieldType[]
    appId: string
    description: string
    status: string
    userFilter: string
    hits: number
    type: string
    options: GenericType & MetaTypeOptions
}> &
    CommonTableType &
    CommonTaskType
