import type { ReportNodeType } from '@gaio/shared/types'
import { defaultReportHeader } from '@/composables/default-reports/defaultReportHeader'
import { defaultSchema } from '@/composables/default-task/defaultSchema'
import { defaultReportTheme } from '@/composables/default-reports/defaultReportTheme'
import { defaultReportChartAxis } from '@/composables/default-reports/defaultReportChartAxis'
import { defaultReportChartLegend } from '@/composables/default-reports/defaultReportChartLegend'

export const defaultReportChartBar = (base: ReportNodeType) => {
    const { settings } = base
    return {
        reportType: 'bar',
        schema: base.schema || defaultSchema,
        settings: {
            ...settings,
            ...defaultReportHeader(settings),
            ...defaultReportChartAxis(settings),
            ...defaultReportChartLegend(settings),
            theme: settings.theme || defaultReportTheme()
            // forms: settings.forms || [],
            // downloadData: settings.downloadData || false,
            // tableStriped: valueIfUndefined(settings.tableStriped, true),
            // tableHover: valueIfUndefined(settings.tableHover, false),
            // tableSm: valueIfUndefined(settings.tableSm, true),
            // tableBordered: valueIfUndefined(settings.tableBordered, true),
            // tableSingleColumn: valueIfUndefined(settings.tableSingleColumn, true),
            // tableSingleLine: valueIfUndefined(settings.tableSingleLine, false),
            // pageSize: settings.pageSize || 10
        }
    }
}
