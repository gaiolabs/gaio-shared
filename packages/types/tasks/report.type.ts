import type { SchemaType } from '../core/schema.type'
import type { TableType } from '../core/table.type'
import type { ReportTaskSettingsType } from './report.task.settings'
import type { FormCardType } from './form-card.type'

export type ReportNodeType = Partial<{
    label: string
    type: string
    reportType: string
    schema: SchemaType
    height: number
    layout: {
        lg: Record<string, any>
        md: Record<string, any>
        sm: Record<string, any>
    }
    settings: ReportTaskSettingsType
}> &
    TableType &
    FormCardType
