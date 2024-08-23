type TaskExplorerType = {
    label: string
    type: string
    children: {
        label: string
        type: string
        reportType: string
        icon: string
        settings?: {
            columnBar?: boolean
            [key: string]: unknown
        }
    }[]
}

export const taskExplorerTypeList = (t): TaskExplorerType[] => {
    return [
        {
            label: t('table'),
            type: 'table',
            children: [
                {
                    label: t('table'),
                    type: 'reportPreview',
                    reportType: 'table',
                    icon: 'table'
                },
                {
                    label: t('pivotTable'),
                    type: 'reportPreview',
                    reportType: 'crossTable',
                    icon: 'crossTable'
                }
            ]
        },
        {
            label: t('charts'),
            type: 'chart',
            children: [
                {
                    label: t('bar'),
                    type: 'reportPreview',
                    reportType: 'bar',
                    icon: 'bar',
                    settings: {
                        columnBar: false
                    }
                },
                {
                    label: t('column'),
                    type: 'reportPreview',
                    reportType: 'bar',
                    icon: 'column',
                    settings: {
                        columnBar: true
                    }
                },
                {
                    label: t('line'),
                    type: 'reportPreview',
                    reportType: 'line',
                    icon: 'line'
                },
                {
                    label: t('area'),
                    type: 'reportPreview',
                    reportType: 'area',
                    icon: 'area'
                },
                {
                    label: t('pie'),
                    type: 'reportPreview',
                    reportType: 'pie',
                    icon: 'pie',
                    settings: {
                        pieDonut: true
                    }
                },
                {
                    label: t('donut'),
                    type: 'reportPreview',
                    reportType: 'pie',
                    icon: 'donut',
                    settings: {
                        pieDonut: false
                    }
                },
                {
                    label: t('scatter'),
                    type: 'reportPreview',
                    reportType: 'scatter',
                    icon: 'scatter'
                },
                {
                    label: t('bubble'),
                    type: 'reportPreview',
                    reportType: 'bubble',
                    icon: 'bubble'
                },
                {
                    label: t('radar'),
                    type: 'reportPreview',
                    reportType: 'radar',
                    icon: 'radar'
                },
                {
                    label: t('heatmap'),
                    type: 'reportPreview',
                    reportType: 'heatmap',
                    icon: 'heatmap'
                },
                {
                    label: t('funnel'),
                    type: 'reportPreview',
                    reportType: 'funnel',
                    icon: 'funnel'
                },
                {
                    label: t('gauge'),
                    type: 'reportPreview',
                    reportType: 'gauge',
                    icon: 'gauge'
                },
                // {
                //     label: t('boxplot'),
                //     type: 'reportPreview',
                //     reportType: 'boxplot',
                //     icon: 'boxplot'
                // },
                // {
                //     label: t('candlestick'),
                //     type: 'reportPreview',
                //     reportType: 'candlestick',
                //     icon: 'candlestick'
                // },
                // {
                //     label: t('sankey'),
                //     type: 'reportPreview',
                //     reportType: 'sankey'
                // },
                {
                    label: t('sunburst'),
                    type: 'reportPreview',
                    reportType: 'sunburst',
                    icon: 'sunburst'
                },
                {
                    label: t('treemap'),
                    type: 'reportPreview',
                    reportType: 'treemap',
                    icon: 'treemap'
                }
                // {
                //     label: t('parallel'),
                //     type: 'reportPreview',
                //     reportType: 'parallel'
                // },
                // {
                //     label: t('themeRiver'),
                //     type: 'reportPreview',
                //     reportType: 'themeRiver'
                // },
                // {
                //     label: t('pictorialBar'),
                //     type: 'reportPreview',
                //     reportType: 'pictorialBar'
                // }
            ]
        },

        {
            label: t('card'),
            type: 'card',
            children: [
                {
                    label: t('simple'),
                    type: 'reportPreview',
                    reportType: 'card',
                    icon: 'cardStats'
                },
                {
                    label: t('download'),
                    type: 'reportPreview',
                    reportType: 'download',
                    icon: 'downloadFile'
                }
            ]
        }
    ]
}
