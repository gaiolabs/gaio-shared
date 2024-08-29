import { defaultReportChartAxis } from '@/composables/default-reports/defaultReportChartAxis'
import { defaultReportChartLegend } from '@/composables/default-reports/defaultReportChartLegend'
import { defaultReportHeader } from '@/composables/default-reports/defaultReportHeader'
import { defaultReportTheme } from '@/composables/default-reports/defaultReportTheme'
import { defaultSchema } from '@/composables/default-task/defaultSchema'
import type { ReportNodeType } from '@gaio/shared/types'

export const defaultReportChartLine = (base: ReportNodeType) => {
	const { settings } = base
	return {
		reportType: 'line',
		schema: base.schema || defaultSchema,
		settings: {
			...settings,
			...defaultReportHeader(settings),
			...defaultReportChartAxis(settings),
			...defaultReportChartLegend(settings),
			theme: settings.theme || defaultReportTheme(),
			lineWidth: 1
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
