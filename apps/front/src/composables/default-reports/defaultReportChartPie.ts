import type { ReportNodeType } from '@gaio/types'
import { defaultReportHeader } from '@/composables/default-reports/defaultReportHeader'
import { defaultSchema } from '@/composables/default-task/defaultSchema'
import { defaultReportTheme } from '@/composables/default-reports/defaultReportTheme'
import { defaultReportChartLegend } from '@/composables/default-reports/defaultReportChartLegend'
import { definedOrDefault } from '@gaio/utils'

export const defaultReportChartPie = (base: ReportNodeType) => {
    const { settings } = base
    return {
        reportType: 'pie',
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
            appendPaddingTop: definedOrDefault(settings.appendPaddingTop, 10),
            appendPaddingBottom: definedOrDefault(settings.appendPaddingBottom, 10),
            appendPaddingLeft: definedOrDefault(settings.appendPaddingLeft, 0),
            appendPaddingRight: definedOrDefault(settings.appendPaddingRight, 0)
        }
    }
}
