import { definedOrDefault } from '@gaio/shared/utils'

export const defaultReportChartLegend = (settings) => {
    return {
        legendFontColor: definedOrDefault(settings.legendFontColor, '#444'),
        legendFontSize: definedOrDefault(settings.legendFontSize, 13),
        showLegend: definedOrDefault(settings.showLegend, false),
        legendPosition: definedOrDefault(settings.legendPosition, 'bottom')
    }
}
