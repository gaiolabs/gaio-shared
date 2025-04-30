export type ReportTaskSettingsType = Partial<{
    forms: string[]
    noDataSentence: string
    columnBackground: boolean
    downloadLabel: string
    downloadRows: number
    downloadSize: number
    downloadColor: string
    downloadData: boolean
    showTotal: boolean
    groupEqualCategory: boolean
    horizontalTotalLabel: string
    horizontalTotalFormatType: string
    horizontalTotalSeparator: string
    horizontalTotalFormatDecimalSize: number
    dimensionFontSize: number
    formOnFirstColumn: boolean
    tableHover: boolean
    tableBordered: boolean
    tableSm: boolean
    tableStriped: boolean
    tableWordBreak: boolean
    tableBorderless: boolean
    tableBackground: string
    tableFontColor: string
    tableFontSize: number
    tableSingleColumn: boolean
    tableSingleLine: boolean
    maxlength: number
    bodyWordWrap: boolean
    appendPaddingLeft: number
    appendPaddingRight: number
    appendPaddingTop: number
    appendPaddingBottom: number
    reportStyle: string
    statisticFontColor: string
    statisticLabel: string
    statisticFontSize: number
    legendFontColor: string
    legendFontSize: number
    title: string
    description: string
    limitRows: number
    pageSize: number
    showTable: boolean
    showLabel: boolean
    showLabelDualExtra: boolean
    showXAxis: boolean
    showYAxis: boolean
    forecastRealAsLine: boolean
    axisFontColor: string
    axisFontSize: number
    labelPersonalized: boolean
    labelFontColor: string
    labelRotate: boolean
    showPoint: boolean
    transposed: boolean
    pointType: string
    bulletRangeType: string
    ranges: Array<{ id: string; color: string; value: number; category: string; fixed: boolean }>
    labelFontSize: number
    staticFontSize: number
    histogramFrequency: number
    titleHeight: number
    titleAlign: 'center' | 'left' | 'right'
    showQuadrant: boolean
    regionStyle: Array<{ fill: string }>
    quadrantX: number
    quadrantY: number
    quadrantContent: string
    titleFontWeight: boolean
    titleFontSize: number
    titleFontColor: string
    titleBold: boolean
    linkFlow: any
    tickMethod: any
    xAxisTickCount: number
    yAxisTickCount: number
    xAxisAutoHideLabel: boolean
    xAxisAutoRotateLabel: boolean
    yAxisAutoHideLabel: boolean
    yAxisAutoRotateLabel: boolean
    strokeItems: boolean
    showLabelType: string
    showLabelDimension: boolean
    showLabelMeasure: boolean
    showLabelPercent: boolean
    labelPositionAlign: string
    labelLengthFirstSegment: number
    labelLengthSecondSegment: number
    labelEdgeDistance: number
    showLegend: boolean
    showStatistic: boolean
    legendPosition: string
    xAxisMinScale: number
    innerRadius: number
    lineWidth: number
    xAxisMaxScale: number
    yAxisMinScale: number
    yAxisMaxScale: number
    yAxisChangeScale: boolean
    xAxisChangeScale: boolean
    totalPosition: string
    comboSyncAxis: boolean
    columnBar: boolean
    stackedPercent: boolean
    showFilter: boolean
    showOrderBy: boolean
    showRows: boolean
    showHeader: boolean
    headerBackgroundDark: boolean
    headerAlign: string
    showXTitle: boolean
    showYTitle: boolean
    labelAngle: number
    groupedOrStacked: boolean
    pieDonut: boolean
    interactionScrollSize: number
    interactionSliderPosition: string
    comboSeriesField: 'grouped' | 'stacked' | 'multipleLine'
    cardFlat: boolean
    cardBackgroundType: string
    cardBackgroundColor: string
    cardBackgroundFontColor: string
    extraColor: string
    cardAlignItems: string
    meterGauge: boolean
    cardBackgroundField: string
    compactNumberAxis: boolean
    compactNumberXAxis: boolean
    compactNumberYAxis: boolean
    compactNumberStatistic: boolean
    compactNumberLabel: boolean
    colorFieldType: string
    fontSize: number
    interactions: string
    showXGrid: boolean
    showYGrid: boolean
    showYLine: boolean
    lineSmooth: boolean
    showXLine: boolean
    guidelineType: string
    guidelineText: string
    guidelineTextPosition: string
    guideScatterType: string
    padding: { topBottom: number; leftRight: number }
    theme: Partial<{ backgroundColor: string; colors: string[]; labelTextFill: string }>
    type: 'report'
    cardPic: string
    condType: string
    condColumnName: string
    condRules: any[]
    linkType: string
    linkValue: string
    linkValueColor: string
    cardColumns: number
    paginate: boolean
    cardTypeStyle: string
    cardDirection: string
    cardMargin: boolean
    cardBorder: boolean
    cardFontColor: string
    cardRows: number
    cardType: 'freeStyle' | 'basic'
    cardHtml: boolean
    cardHtmlCode: string
    showFullYear: boolean
    showPathTreemap: boolean
    enableTreemapZoom: boolean
    treemapLeafDepth: number
    cardChartType: 'line' | 'bar' | 'area'
    card:{
        title:{
            showColumnName:boolean
            fontWeight: string
            fontSize: number
            fontColor: string
        },
        subtitle:{
            showColumnName:boolean
            fontWeight: string
            fontSize: number
            fontColor: string
        },
        measure:{
            showColumnName:boolean
            fontWeight: string
            fontSize: number
            fontColor: string
        },

    }
    pieDonutTotal: {
        show: boolean
        fontColor: string
        fontSize: number
        fontBold: boolean
        top: number
        bottom: number
        left: number
        right: number
    }
    tooltip:{
        show: boolean
        fontColor: string
        trigger:  'item' | 'axis' 
        fontSize: number
        hideNullValues: boolean
        hideZeroValues: boolean
    }

}>
