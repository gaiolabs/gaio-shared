import type { ReportNodeType } from '@gaio/shared/types'
import { defaultReportHeader } from '@/composables/default-reports/defaultReportHeader'
import { defaultSchema } from '@/composables/default-task/defaultSchema'

const valueIfUndefined = (prop: boolean | undefined, value: boolean) => (prop === undefined ? value : prop)

export const defaultTableReport = (base: ReportNodeType) => {
    const { settings } = base
    return {
        reportType: 'table',
        schema: base.schema || defaultSchema,
        settings: {
            ...defaultReportHeader(settings),
            forms: settings.forms || [],
            downloadData: settings.downloadData || false,
            tableStriped: valueIfUndefined(settings.tableStriped, true),
            tableHover: valueIfUndefined(settings.tableHover, false),
            tableSm: valueIfUndefined(settings.tableSm, true),
            tableBordered: valueIfUndefined(settings.tableBordered, true),
            tableSingleColumn: valueIfUndefined(settings.tableSingleColumn, true),
            tableSingleLine: valueIfUndefined(settings.tableSingleLine, false),
            pageSize: settings.pageSize || 10
        }
    }
}
