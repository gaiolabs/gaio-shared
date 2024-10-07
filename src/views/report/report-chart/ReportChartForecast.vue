<template>
	<VChart
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
import type { EChartsOption, XAXisOption, SeriesOption, YAXisOption } from 'echarts/types/dist/shared'
import { ref } from 'vue'
import VChart from 'vue-echarts'
import useReportChartHelper from './helpers/ReportChartHelper'
import useReportChartHelperAxis from './helpers/ReportChartHelperAxis'
import useReportChartHelperGrid from './helpers/ReportChartHelperGrid'
import useReportChartHelperLabel from './helpers/ReportChartHelperLabel'
import useReportChartHelperLegend from './helpers/ReportChartHelperLegend'
import useReportChartHelperTicks from './helpers/ReportChartHelperTicks'

const { task, list, height } = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()

const { dimensions, measures, settings, themeColors, columnName } = computed(() => useReportChartHelper(task)).value
const { commonXAxisConfigs, commonYAxisConfigs } = computed(() => useReportChartHelperAxis(task)).value
const { grid } = computed(() => useReportChartHelperGrid(task)).value
const { legend } = computed(() => useReportChartHelperLegend(task)).value
const { label } = computed(() => useReportChartHelperLabel(task)).value
const { treatLabelsTicks } = computed(() => useReportChartHelperTicks()).value

use([CanvasRenderer, GridComponent, BarChart, TitleComponent, TooltipComponent, LegendComponent])

const orderedList = list.sort(
	(a, b) =>
		new Date(a[columnName(dimensions.value.first)] as string).getTime() -
		new Date(b[columnName(dimensions.value.first)] as string).getTime(),
)

console.log('orderedList', JSON.stringify(orderedList))

const dates = orderedList.map((item) => item[columnName(dimensions.value.first)]) as string[]
const realData = orderedList.map((item) => item[columnName(measures.value.first)]) as number[]
const forecastData = orderedList.map((item) => item[columnName(measures.value.second)]) as number[]
const lowerBound = orderedList.map((item) => item[columnName(measures.value.third)] as number[])
const upperBound = orderedList.map((item) => item[columnName(measures.value.fourth)] as number[])

const option = ref<EChartsOption>({
	title: {
		text: 'Previsão de Dados',
	},
	tooltip: {
		trigger: 'axis',
	},
	legend: {
		data: ['Histórico', 'Previsão', 'Intervalo de Previsão'],
	},
	xAxis: {
		type: 'category',
		data: dates,
	},
	yAxis: {
		type: 'value',
	},
	series: [
		{
			name: 'Real',
			type: 'scatter',
			data: realData,
		},
		{
			name: 'Previsão',
			type: 'line',
			data: forecastData,
			smooth: true,
			lineStyle: {
				type: 'dashed',
				color: '#91CC75',
				width: 3,
			},
		},
		{
			name: 'Intervalo de Previsão',
			type: 'line',
			data: upperBound,
			smooth: true,
			lineStyle: {
				opacity: 0,
			},
			areaStyle: {
				color: 'rgba(144, 238, 144, 0.3)',
			},
		},
		{
			name: 'Intervalo de Previsão',
			type: 'line',
			data: lowerBound,
			smooth: true,
			lineStyle: {
				opacity: 0,
			},
			areaStyle: {
				color: 'rgba(144, 238, 144, 0.3)',
			},
		},
	],
})

// watch(
// 	[() => task, () => list, dimensions, measures, themeColors],
// 	() => {
// 		option.value = {
// 			...option.value,
// 			color: themeColors.value,
// 			xAxis: xAxis(),
// 			yAxis: yAxis(),
// 			series: series(),
// 			legend: legend(),
// 			label: label(measures.value.measures),
// 			grid: grid(),
// 		}
// 	},
// 	{ deep: true },
// )
</script>

<!-- <template>
	<div class="report-column">
		<div
			ref="id"
			class="size-full"
			:style="{ height }"
		/>
	</div>
</template>

<script setup lang="ts">
import { Column, type ColumnOptions } from '@antv/g2plot'
import type { ReportNodeType } from '@gaio/shared/types'
import { sumBy } from 'lodash-es'
import { computed, nextTick } from 'vue'
import { onMounted, shallowRef, watch } from 'vue'
import useReportChartHelper from './ReportChartHelper'

defineEmits(['change'])
const { task, list, height } = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()

const chartHelper = computed(() => useReportChartHelper(task, list))
const {
	dimensions,
	measures,
	settings,
	foundation,
	columnName,
	processedList,
	themeColors,
	isGrouped,
	isMultipleMeasure,
	firstMeasure,
	firstDimension,
	secondDimension,
	linearLabel,
} = chartHelper.value

const id = shallowRef()
let chart = shallowRef<Column>()

const total = computed(() => {
	return sumBy(processedList('column'), (o) => {
		return o[columnName(firstMeasure.value)] ? o[columnName(firstMeasure.value)] : 0
	})
})

const getOptions = (): ColumnOptions => {
	return {
		data: processedList('column'),
		xField: columnName(firstDimension.value),
		yField: !isGrouped.value && isMultipleMeasure.value ? 'measure' : columnName(firstMeasure.value),
		seriesField:
			isGrouped.value && !isMultipleMeasure.value ? columnName(secondDimension.value)
			: isMultipleMeasure.value ? 'category'
			: settings.value.showLegend ? columnName(firstDimension.value)
			: undefined,
		...foundation.value,
		isGroup: isGrouped.value || isMultipleMeasure.value,
		appendPadding: [10, 10, 10, 10],
		color:
			isGrouped.value || isMultipleMeasure.value ? themeColors.value
			: settings.value.showLegend ? themeColors.value
			: themeColors.value[0],
		label: linearLabel(total.value),
		columnBackground:
			settings.value.columnBackground ?
				{
					style: {
						fill: 'rgba(0,0,0,0.08)',
					},
				}
			:	undefined,
	}
}

const loadChart = () => {
	if (!id.value) return
	chart.value = new Column(id.value as HTMLElement, getOptions())
	chart.value.render()
}

watch(
	[() => task, () => list, dimensions, measures],
	() => {
		chart.value.update(getOptions())
	},
	{ deep: true },
)

onMounted(() => {
	nextTick(() => loadChart())
})
</script> -->
