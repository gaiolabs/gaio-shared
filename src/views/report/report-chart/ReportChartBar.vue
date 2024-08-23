<template>
    <div class="report-bar">
        <v-chart
            class="chart"
            style="height: 350px"
            :option="option"
        />
    </div>
</template>

<script setup lang="ts">
import type { ReportNodeType } from '@gaio/types'
import { computed, nextTick } from 'vue'
import { onMounted, shallowRef } from 'vue'
import useReportChartHelper from './ReportChartHelper'
import { fold } from '@/views/report/report-chart/fold'
import { groupBy, sumBy } from 'lodash-es'

defineEmits(['change'])
const props = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()

// const chartHelper = computed(() => useReportChartHelper(props.task))
// const { dimensions, measures, settings, columnName, themeColors, appendPadding, foundation } = chartHelper.value
//
// const total = computed(() => {
//     return sumBy(localList.value, (o) => {
//         return o[columnName(measures.value[0])] ? o[columnName(measures.value[0])] : 0
//     })
// })
//
// const id = shallowRef()
// const chart = shallowRef()
// const localList = shallowRef([])
//
// const isMultipleMeasure = computed(() => {
//     return props.task.schema.select.filter((o) => o.type !== 'value').length > 1
// })
//
// const isGrouped = computed(() => {
//     return props.task.schema.select.filter((o) => o.type === 'value').length > 1
// })
//
// const loadChart = () => {
//     let common = {} as Partial<Record<string, unknown>>
//     if (!isGrouped.value && isMultipleMeasure.value) {
//         common.isGroup = true
//         common.yField = columnName(dimensions.value[0])
//         common.xField = 'measure'
//         common.seriesField = 'category'
//         common.dodgePadding = 1
//     } else if (isGrouped.value) {
//         common.isGroup = true
//         common.yField = columnName(dimensions.value[0])
//         common.xField = columnName(measures.value[0])
//         common.seriesField = columnName(dimensions.value[1])
//         common.dodgePadding = 1
//     } else {
//         common.yField = columnName(dimensions.value[0])
//         common.xField = columnName(measures.value[0])
//     }
//
//     common.padding = appendPadding()
//
//     chart.value = new Bar(
//         id.value as HTMLElement,
//         {
//             data: localList.value,
//             ...common,
//             color:
//                 isGrouped.value || isMultipleMeasure.value ? themeColors.value
//                 : settings.value.showLegend ? themeColors.value
//                 : themeColors.value[0],
//             label: chartHelper.value.linearLabel(total),
//             ...foundation.value,
//             barBackground:
//                 settings.value.columnBackground ?
//                     {
//                         style: {
//                             fill: 'rgba(0,0,0,0.08)'
//                         }
//                     }
//                 :   undefined
//         } as BarOptions
//     )
//     chart.value.render()
// }
//
// onMounted(() => {
//     let data = localList.value
//
//     if (isGrouped.value || !isMultipleMeasure.value) {
//         localList.value = data
//     } else {
//         localList.value = fold(data, measures.value)
//     }
//
//     nextTick(() => loadChart())
// })

import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    type GridComponentOption
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { ref, provide } from 'vue'

use([CanvasRenderer, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

// provide(THEME_KEY, 'dark')

const option = ref({})
const localList = ref([])

const chartHelper = computed(() => useReportChartHelper(props.task))
const { dimensions, measures, settings, columnName, themeColors, appendPadding, foundation } = chartHelper.value

const series = computed(() => {
    let defineSeries = []

    if (isGrouped.value) {
        return defineSeries
    } else {
        for (let i = 0; i < measures.value.length; i++) {
            defineSeries.push({
                data: localList.value.map((o) => o[columnName(measures.value[i])]),
                type: 'bar'
            })
        }
    }
    return defineSeries
})

const yAxis = computed(() => {
    return {
        type: 'category',
        data: localList.value.map((o) => o[dimensions.value[0].alias || dimensions.value[0].columnName])
    }
})

const defineDataset = computed(() => {
    let data = props.list
    const fields = props.task.schema.select.map((o) => columnName(o))

    let datasetSource = data.map((item) => {
        let row = []
        fields.forEach((field) => {
            row.push(item[field])
        })
        return row
    })

    datasetSource.unshift(fields)

    return datasetSource
})

const defineOption = () => {
    console.log(dimensions)
    option.value = {
        color: props.task.settings.theme.colors,
        grid: {
            left: '1%',
            right: '1%',
            bottom: '3%',
            top: '3%',
            containLabel: true
        } as GridComponentOption,
        dataset: {
            source: defineDataset.value
        },
        xAxis: {
            // type: 'value'
        },
        yAxis: {
            type: 'category'
        },
        series: [
            {
                type: 'bar',
                encode: {
                    // Map "amount" column to x-axis.
                    y: dimensions.value[0].alias || dimensions.value[0].columnName,
                    // Map "product" row to y-axis.
                    x: measures.value[0].alias || measures.value[0].columnName
                }
            }
        ]
        // series: series.value
    }

    console.log(option.value)
}

const isMultipleMeasure = computed(() => {
    return props.task.schema.select.filter((o) => o.type !== 'value').length > 1
})

const isGrouped = computed(() => {
    return props.task.schema.select.filter((o) => o.type === 'value').length > 1
})

onMounted(() => {
    let data = props.list

    if (isGrouped.value || !isMultipleMeasure.value) {
        localList.value = data
    } else {
        localList.value = fold(data, measures.value)
    }

    console.log(localList.value)

    defineOption()
})
</script>
