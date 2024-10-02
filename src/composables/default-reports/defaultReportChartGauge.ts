import { defaultReportChartLegend } from '@/composables/default-reports/defaultReportChartLegend'
import { defaultReportHeader } from '@/composables/default-reports/defaultReportHeader'
import { defaultReportTheme } from '@/composables/default-reports/defaultReportTheme'
import { defaultSchema } from '@/composables/default-task/defaultSchema'
import type { ReportNodeType } from '@gaio/shared/types'
import { definedOrDefault } from '@gaio/shared/utils'

export const defaultReportChartGauge = (base: ReportNodeType) => {
	const { settings } = base
	return {
		reportType: 'gauge',
		schema: base.schema || defaultSchema,
		settings: {
			...settings,
			...defaultReportHeader(settings),
			...defaultReportChartLegend(settings),
			theme: settings.theme || defaultReportTheme(),
			showStatistic: definedOrDefault(settings.showStatistic, true),
			statisticFontSize: definedOrDefault(settings.statisticFontSize, 14),
			statisticFontColor: settings.statisticFontColor || '#333',
			compactNumberLabel: definedOrDefault(settings.compactNumberLabel, true),
			compactNumberStatistic: definedOrDefault(settings.compactNumberStatistic, true),
			statisticLabel: definedOrDefault(settings.statisticLabel, 'Total'),
			showLabel: definedOrDefault(settings.showLabel, true),
			showLabelType: definedOrDefault(settings.showLabelType, 'top'),
			showLabelMeasure: definedOrDefault(settings.showLabelMeasure, true),
			showLabelDimension: definedOrDefault(settings.showLabelDimension, true),
			showLabelPercent: definedOrDefault(settings.showLabelPercent, false),
			appendPaddingTop: definedOrDefault(settings.appendPaddingTop, 0),
			appendPaddingBottom: definedOrDefault(settings.appendPaddingBottom, 0),
			appendPaddingLeft: definedOrDefault(settings.appendPaddingLeft, 0),
			appendPaddingRight: definedOrDefault(settings.appendPaddingRight, 0),
		},
	}
}
