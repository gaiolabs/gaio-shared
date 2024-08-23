const definedOrDefault = (value, defaultValue) => {
    return value === undefined ? defaultValue : value
}

export const defaultReportChartAxis = (settings) => {
    return {
        showYAxis: definedOrDefault(settings.showYAxis, true),
        showXAxis: definedOrDefault(settings.showXAxis, true),
        xAxisTickCount: definedOrDefault(settings.xAxisTickCount, 0),
        yAxisTickCount: definedOrDefault(settings.yAxisTickCount, 0),
        xAxisAutoHideLabel: definedOrDefault(settings.xAxisAutoHideLabel, true),
        xAxisAutoRotateLabel: definedOrDefault(settings.xAxisAutoRotateLabel, false),
        yAxisAutoHideLabel: definedOrDefault(settings.yAxisAutoHideLabel, true),
        yAxisAutoRotateLabel: definedOrDefault(settings.yAxisAutoRotateLabel, false),
        xAxisMinScale: definedOrDefault(settings.xAxisMinScale, 0),
        xAxisMaxScale: definedOrDefault(settings.xAxisMaxScale, 1000),
        yAxisMinScale: definedOrDefault(settings.yAxisMinScale, 0),
        yAxisMaxScale: definedOrDefault(settings.yAxisMaxScale, 1000),
        yAxisChangeScale: definedOrDefault(settings.yAxisChangeScale, false),
        xAxisChangeScale: definedOrDefault(settings.xAxisChangeScale, false),

        // grid
        showXGrid: definedOrDefault(settings.showXGrid, false),
        showYGrid: definedOrDefault(settings.showYGrid, true),
        showYLine: definedOrDefault(settings.showYLine, true),
        showXLine: definedOrDefault(settings.showXLine, true)
    }
}
