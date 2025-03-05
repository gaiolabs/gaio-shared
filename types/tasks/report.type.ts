import type { SchemaType } from '../core/schema.type'
import type { TableType } from '../core/table.type'
import type { ReportTaskSettingsType } from './report.task.settings'
import type { FormCardType } from './form-card.type'
import type { StaticContentType } from './static-content.type'
import { ReportTypeKeys } from './report.keys.type'


type RecordNodeLayoutItemType = Partial<{
    x: number
    y: number
    w: number
    h: number
    i: string
    hidden: boolean
}>

export type RecordNodeLayoutType = Partial<{
    lg:RecordNodeLayoutItemType
    md: RecordNodeLayoutItemType
    sm: RecordNodeLayoutItemType
}>

export type ReportNodeType = Partial<{
    label: string
    type: 'report'
    reportType: ReportTypeKeys
    schema: SchemaType
    height: number
    layout: RecordNodeLayoutType
    settings: ReportTaskSettingsType
}> &
    TableType &
    FormCardType &
    StaticContentType

