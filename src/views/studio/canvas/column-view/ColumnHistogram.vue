<template>
    <div>
        <div class="mb-2 flex items-baseline gap-2 px-4">
            <n-slider
                v-model:value="histogramOption.range"
                range
                :min="columnData.min"
                :max="columnData.max"
                :marks="{
                    [columnData.min]: columnData.min,
                    [columnData.max]: columnData.max
                }"
                @dragend="loadHistogramData()"
            />
            <n-select
                v-model:value="histogramOption.bins"
                :options="binList"
                size="small"
                @change="loadHistogramData"
            />
        </div>

        <div class="min-h-[100px] p-2">
            <div
                ref="container"
                class="h-[300px] w-full"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { BarChart } from 'echarts/charts'
import {
    DatasetComponent,
    GridComponent,
    TitleComponent,
    TooltipComponent,
    TransformComponent
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { computed, nextTick, onMounted, ref } from 'vue'

import useApi from '@/composables/useApi'
import useFormatValue from '@/composables/useFormatValue'
import { useAppStore } from '@/stores'
import { useColumnView } from '@/views/studio/canvas/column-view/useColumnView'

const binList = [2, 4, 8, 10, 12, 14, 16, 18, 20, 22].map((o) => {
    return {
        label: o + ' bins',
        value: o
    }
})

echarts.use([
    BarChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer
])

const { columnData } = useColumnView().$state

const container = ref()
const loading = ref(false)
const myCart = ref()

const histogramOption = ref({
    bins: 16,
    range: [columnData.min, columnData.max] as [number, number]
})

const { defaultFormatNumeric, defaultFormatDecimal } = useFormatValue()

const loadHistogramData = async () => {
    loading.value = true
    const { data } = await useApi().post(`api/table/histogram`, {
        body: {
            taskData: {
                ...useAppStore().task,
                columnName: columnData.columnName,
                hasFilters: '',
                bins: histogramOption.value.bins,
                range: histogramOption.value.range
            }
        }
    })

    const values = data[0]

    const bColumnName = [...new Array(histogramOption.value.bins)].map((o, i) => `b${i + 1}`)
    const b = bColumnName.map((o) => values[o])
    const q = bColumnName.map((o, i) => {
        return values[`q${i + 1}`]
    })

    const second = []

    for (const [i, v] of Object.entries(q)) {
        second.push({
            name: 'a' + i,
            category: '[' + valueFormat.value(b[i] - values.binRange) + ',\n' + valueFormat.value(b[i]) + ')',
            value: Number(v)
        })
    }

    const option = {
        dataset: {
            dimensions: ['category', 'value'],
            source: second
        },
        tooltip: {
            formatter: function (params) {
                return params.marker + ' ' + params.data.category + ': ' + defaultFormatNumeric(params.data.value)
            }
        },
        grid: {
            top: '15px',
            left: '50px',
            right: '20px',
            bottom: '40px'
        },
        xAxis: { type: 'category' },
        yAxis: {},
        series: [
            {
                type: 'bar',
                barWidth: '98%',
                label: {
                    show: true,
                    position: 'top',
                    formatter: function (params) {
                        return defaultFormatNumeric(params.data.value || 0)
                    }
                }
            }
        ]
    }

    loading.value = false
    myCart.value.setOption(option)
}
const valueFormat = computed(() => {
    if (columnData.dataType.includes('Int')) {
        return defaultFormatNumeric
    } else {
        return defaultFormatDecimal
    }
})

onMounted(() => {
    nextTick(() => {
        myCart.value = echarts.init(container.value)
        loadHistogramData()
    })
})
</script>
