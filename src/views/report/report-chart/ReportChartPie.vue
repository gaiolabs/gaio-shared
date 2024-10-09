<template>
	<VChart
		id="ReportChartPie"
		:style="{ height }"
		:option="option"
		autoresize
	/>
</template>

<script setup lang="ts">
import type { ReportNodeType } from '@gaio/shared/types'
import { BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { GridComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption, PieSeriesOption } from 'echarts/types/dist/shared'
import { ref } from 'vue'
import VChart from 'vue-echarts'
import useReportChartHelper from './helpers/ReportChartHelper'
import useReportChartHelperGrid from './helpers/ReportChartHelperGrid'
import useReportChartHelperLabel from './helpers/ReportChartHelperLabel'
import useReportChartHelperLegend from './helpers/ReportChartHelperLegend'

const { task, list, height } = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()

const { dimensions, measures, themeColors, columnName } = computed(() => useReportChartHelper(task)).value
const { grid } = computed(() => useReportChartHelperGrid(task)).value
const { legend } = computed(() => useReportChartHelperLegend(task)).value
const { labelPie } = computed(() => useReportChartHelperLabel(task)).value

use([CanvasRenderer, GridComponent, BarChart, TitleComponent, TooltipComponent, LegendComponent])

const series = () => {
	const values = list.map((item) => {
		return {
			value: item[columnName(measures.value.first)],
			name: item[columnName(dimensions.value.first)],
		}
	})
	return {
		name: columnName(measures.value.first),
		type: 'pie',
		data: values,
		label: labelPie(),
		radius: ['0%', '100%'],
		...grid(),
	} as PieSeriesOption | PieSeriesOption[]
}

const option = ref<EChartsOption>({
	tooltip: {
		trigger: 'item',
	},
	color: themeColors.value,
	series: series(),
	legend: legend(),
})

watch(
	[() => task, () => list, dimensions, measures, themeColors],
	() => {
		option.value = {
			...option.value,
			color: themeColors.value,
			series: series(),
			legend: legend(),
		}
	},
	{ deep: true },
)
</script>

<!-- <template>
	<div class="report-pie">
		<div
			ref="id"
			class="size-full"
			:style="{ height }"
		/>
	</div>
</template>

<script setup lang="ts">
import useFormatValue from '@/composables/useFormatValue'
import { Pie, type PieOptions } from '@antv/g2plot'
import type { ReportNodeType } from '@gaio/shared/types'
import { computed, nextTick } from 'vue'
import { onMounted, shallowRef } from 'vue'
import useReportChartHelper from './ReportChartHelperGplot'

defineEmits(['change'])
const { task, list, height } = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()

const {
	settings,
	firstMeasure,
	firstDimension,
	secondDimension,
	meta,
	dimensions,
	measures,
	columnName,
	processedList,
	legend
} = useReportChartHelper(task, list)

const { formatValue } = useFormatValue()
const id = shallowRef()
const chart = shallowRef()

const labelPosition = computed(() => {
	switch (settings.value.showLabelType) {
		case 'top':
			return 'outer'
		case 'bottom':
			return 'spider'
		default:
			return 'inner'
	}
})

const getOptions = (): PieOptions => {
	return {
		animation: false,
		data: processedList('pie'),
		colorField: columnName(firstDimension.value),
		angleField: columnName(firstMeasure.value),
		radius: 1,
		innerRadius: null,
		meta: meta.value,
		autoFit: true,
		padding: 'auto',
		color: settings.value.theme.colors,
		legend: legend(),
		label:
			settings.value.showLabel ?
				{
					type: labelPosition.value || 'spider',
					autoRotate: true,

					style: {
						lineWidth: 0,
						fontSize: Number(settings.value.labelFontSize || 11),
						fill: settings.value.labelFontColor
					},
					labelHeight: 60,
					content: (v) => {
						let text = []
						if (settings.value.showLabelDimension) {
							if (dimensions.value.length > 1)
								text.push(`${v[columnName(firstDimension.value)]} - ${v[columnName(secondDimension.value)]}`)
							else text.push(v[columnName(firstDimension.value)])
						}

						if (settings.value.showLabelMeasure) {
							let value = v['measure'] || v[columnName(firstMeasure.value)]

							value = formatValue(value, {
								...firstMeasure.value,
								compactNumber: settings.value.compactNumberLabel
							})

							text.push(value)
						}

						if (settings.value.showLabelPercent) {
							text.push((v.percent * 100).toFixed(2) + '%')
						}

						return text.join('\n')
					}
				}
			:	null,
		statistic: null,
		interactions: [{ type: 'element-selected' }]
	}
}

const loadChart = () => {
	if (!id.value) return
	chart.value = new Pie(id.value as HTMLElement, getOptions())
	chart.value.render()
}

watch(
	[() => task, () => list, dimensions, measures],
	() => {
		chart.value.update(getOptions())
	},
	{ deep: true }
)

onMounted(() => {
	nextTick(() => loadChart())
})
</script> -->
