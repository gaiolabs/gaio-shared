import { defaultReportChartAxis } from '@/composables/default-reports/defaultReportChartAxis'
import { defaultReportChartLegend } from '@/composables/default-reports/defaultReportChartLegend'
import { defaultReportHeader } from '@/composables/default-reports/defaultReportHeader'
import { defaultReportTheme } from '@/composables/default-reports/defaultReportTheme'
import { defaultSchema } from '@/composables/default-task/defaultSchema'
import type { ReportNodeType } from '@gaio/shared/types'

export const defaultReportChartFunnel = (base: ReportNodeType) => {
	const { settings } = base
	return {
		reportType: 'funnel',
		schema: base.schema || defaultSchema,
		settings: {
			...settings,
			...defaultReportHeader(settings),
			...defaultReportChartAxis(settings),
			...defaultReportChartLegend(settings),
			theme: settings.theme || defaultReportTheme()
		}
	}
}
