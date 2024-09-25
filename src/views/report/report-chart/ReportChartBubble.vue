<template>
	<VChart
		:style="{ height }"
		:option="option"
		autoresize
	/>
</template>

<script setup lang="ts">
import useFormatValue from '@/composables/useFormatValue'
import type { ReportNodeType } from '@gaio/shared/types'
import { registerTransform } from 'echarts'
import ecStat from 'echarts-stat'
import { ScatterChart, LineChart } from 'echarts/charts'
import {
	TitleComponent,
	TooltipComponent,
	LegendComponent,
	MarkAreaComponent,
	MarkLineComponent,
	VisualMapComponent,
} from 'echarts/components'
import { GridComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import type {
	EChartsOption,
	XAXisOption,
	SeriesOption,
	YAXisOption,
	DatasetOption,
	VisualMapComponentOption,
} from 'echarts/types/dist/shared'
import { ref } from 'vue'
import VChart from 'vue-echarts'
import useReportChartHelper from './helpers/ReportChartHelper'
import useReportChartHelperAxis from './helpers/ReportChartHelperAxis'
import useReportChartHelperGrid from './helpers/ReportChartHelperGrid'
import useReportChartHelperLabel from './helpers/ReportChartHelperLabel'
import useReportChartHelperLegend from './helpers/ReportChartHelperLegend'
import useReportChartHelperMarkArea from './helpers/ReportChartHelperMarkArea'
import useReportChartHelperMarkLine from './helpers/ReportChartHelperMarkLine'
import useReportChartHelperTicks from './helpers/ReportChartHelperTicks'

const { task, list, height } = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()

const { dimensions, measures, settings, themeColors, columnName } = computed(() => useReportChartHelper(task)).value
const { commonXAxisConfigs, commonYAxisConfigs } = computed(() => useReportChartHelperAxis(task)).value
const { grid } = computed(() => useReportChartHelperGrid(task)).value
const { legend } = computed(() => useReportChartHelperLegend(task)).value
const { label } = computed(() => useReportChartHelperLabel(task)).value
const { treatLabelsTicks, getMinMaxValues } = computed(() => useReportChartHelperTicks()).value
const { markArea } = computed(() => useReportChartHelperMarkArea(task)).value
const { markLine } = computed(() => useReportChartHelperMarkLine(task)).value
const { formatValue } = useFormatValue()

use([
	CanvasRenderer,
	GridComponent,
	MarkAreaComponent,
	MarkLineComponent,
	ScatterChart,
	LineChart,
	TitleComponent,
	TooltipComponent,
	LegendComponent,
	VisualMapComponent,
])

const ecStatLocal: any = ecStat
registerTransform(ecStatLocal.transform.regression)

const xAxis = () => {
	const values = list.map((item) => item[columnName(measures.value.first)]) as Array<number | string | Date>
	const ticksLabels = treatLabelsTicks(values, settings.value.xAxisTickCount)
	return {
		...commonXAxisConfigs(ticksLabels, columnName(measures.value.first)),
	} as XAXisOption | XAXisOption[]
}

const yAxis = () => {
	const values = list.map((item) => item[columnName(measures.value.second)]) as Array<number | string | Date>
	const ticksLabels = treatLabelsTicks(values, settings.value.yAxisTickCount)
	return {
		...commonYAxisConfigs(ticksLabels, columnName(measures.value.second)),
	} as YAXisOption | YAXisOption[]
}

// const firstDimensionsData = computed(() => [
// 	...new Set(
// 		list.map((item) => {
// 			return item[columnName(dimensions.value.first)]
// 		}),
// 	),
// ])

// const treatedData = computed(() =>
// 	list.map((item) => {
// 		return [
// 			item[columnName(measures.value.first)],
// 			item[columnName(measures.value.second)],
// 			item[columnName(measures.value.third)],
// 			item[columnName(dimensions.value.second)],
// 			item[columnName(dimensions.value.first)],
// 		]
// 	}),
// )

const firstDimensionsData = computed(() => [...new Set([1990, 2015])])

const treatedData = computed(() => [
	[28604, 77, 17096869, 'Australia', 1990],
	[31163, 77.4, 27662440, 'Canada', 1990],
	[1516, 68, 1154605773, 'China', 1990],
	[13670, 74.7, 10582082, 'Cuba', 1990],
	[28599, 75, 4986705, 'Finland', 1990],
	[29476, 77.1, 56943299, 'France', 1990],
	[31476, 75.4, 78958237, 'Germany', 1990],
	[28666, 78.1, 254830, 'Iceland', 1990],
	[1777, 57.7, 870601776, 'India', 1990],
	[29550, 79.1, 122249285, 'Japan', 1990],
	[2076, 67.9, 20194354, 'North Korea', 1990],
	[12087, 72, 42972254, 'South Korea', 1990],
	[24021, 75.4, 3397534, 'New Zealand', 1990],
	[43296, 76.8, 4240375, 'Norway', 1990],
	[10088, 70.8, 38195258, 'Poland', 1990],
	[19349, 69.6, 147568552, 'Russia', 1990],
	[10670, 67.3, 53994605, 'Turkey', 1990],
	[26424, 75.7, 57110117, 'United Kingdom', 1990],
	[37062, 75.4, 252847810, 'United States', 1990],
	[44056, 81.8, 23968973, 'Australia', 2015],
	[43294, 81.7, 35939927, 'Canada', 2015],
	[13334, 76.9, 1376048943, 'China', 2015],
	[21291, 78.5, 11389562, 'Cuba', 2015],
	[38923, 80.8, 5503457, 'Finland', 2015],
	[37599, 81.9, 64395345, 'France', 2015],
	[44053, 81.1, 80688545, 'Germany', 2015],
	[42182, 82.8, 329425, 'Iceland', 2015],
	[5903, 66.8, 1311050527, 'India', 2015],
	[36162, 83.5, 126573481, 'Japan', 2015],
	[1390, 71.4, 25155317, 'North Korea', 2015],
	[34644, 80.7, 50293439, 'South Korea', 2015],
	[34186, 80.6, 4528526, 'New Zealand', 2015],
	[64304, 81.6, 5210967, 'Norway', 2015],
	[24787, 77.3, 38611794, 'Poland', 2015],
	[23038, 73.13, 143456918, 'Russia', 2015],
	[19360, 76.5, 78665830, 'Turkey', 2015],
	[38225, 81.4, 64715810, 'United Kingdom', 2015],
	[53354, 79.1, 321773631, 'United States', 2015],
])

const visualMap = () => {
	const minMax = getMinMaxValues(
		list.map((item) => item[columnName(measures.value.third)]) as Array<number | string | Date>,
	)
	const seriesIndex = firstDimensionsData.value.map((_, index) => index)
	return {
		show: false,
		dimension: 2,
		min: minMax.min,
		max: minMax.max,
		seriesIndex: seriesIndex,
		inRange: {
			symbolSize: [10, 60],
		},
	} as VisualMapComponentOption
}

const xMinMax = getMinMaxValues(
	list.map((item) => item[columnName(measures.value.first)]) as Array<number | string | Date>,
)
const yMinMax = getMinMaxValues(
	list.map((item) => item[columnName(measures.value.second)]) as Array<number | string | Date>,
)
const serieData = firstDimensionsData.value.map((item, index) => {
	return {
		name: item,
		type: 'scatter',
		datasetIndex: index + 1,
		markLine: markLine(xMinMax, yMinMax),
		markArea: markArea(xMinMax, yMinMax),
	} as SeriesOption
})

const series = () => {
	return [
		...serieData,
		{
			name: 'line',
			type: 'line',
			smooth: true,
			datasetIndex: 2,
			symbolSize: 0.1,
			symbol: 'circle',
			label: { show: false },
			labelLayout: { dx: -20 },
			encode: {
				label: 2,
				tooltip: 1,
			},
		},
	] as SeriesOption | SeriesOption[]
}

const transformData = firstDimensionsData.value.map((item) => {
	return {
		transform: {
			type: 'filter',
			config: {
				dimension: 4,
				eq: item,
			},
			// print: true,
		},
	}
})
const dataset = () => {
	return [
		{
			source: treatedData.value,
		},
		...transformData,
		settings.value.guideScatterType && settings.value.guideScatterType !== 'none' ?
			{
				transform: {
					type: 'ecStat:regression',
					config: {
						method: settings.value.guideScatterType ?? 'linear',
					},
				},
			}
		:	null,
	] as DatasetOption
}

const option = ref<EChartsOption>({
	dataset: [
		{
			source: treatedData.value,
		},
		...transformData,
		{
			transform: {
				type: 'ecStat:regression',
				config: {
					method: 'logarithmic',
				},
			},
		},
	],
	title: {
		text: '1990 and 2015 per capita life expectancy and GDP',
		subtext: 'By ecStat.regression',
		sublink: 'https://github.com/ecomfe/echarts-stat',
		left: 'center',
	},
	legend: {
		data: ['1990', '2015'],
		bottom: 10,
	},
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'cross',
		},
	},
	xAxis: xAxis(),
	yAxis: yAxis(),
	visualMap: {
		show: false,
		dimension: 2,
		min: 20000,
		max: 1500000000,
		seriesIndex: [0, 1],
		inRange: {
			symbolSize: [10, 70],
		},
	},
	series: [
		...serieData,
		{
			name: 'line',
			type: 'line',
			smooth: true,
			datasetIndex: 3,
			symbolSize: 0.1,
			symbol: 'circle',
			label: { show: true, fontSize: 16 },
			labelLayout: { dx: -20 },
			encode: { label: 2, tooltip: 1 },
		},
	],
})
// const option = ref<EChartsOption>({
// 	dataset: dataset(),
// 	tooltip: {
// 		trigger: 'axis',
// 		axisPointer: {
// 			type: 'cross',
// 		},
// 	},
// 	color: themeColors.value,
// 	legend: legend(),
// 	label: label(measures.value.measures),
// 	grid: grid(),
// 	xAxis: xAxis(),
// 	yAxis: yAxis(),
// 	series: series(),
// 	visualMap: visualMap(),
// })

watch(
	[() => task, () => list, dimensions, measures, themeColors],
	() => {
		console.log('transformData', ...transformData)
		option.value = {
			...option.value,
			color: themeColors.value,
			xAxis: xAxis(),
			yAxis: yAxis(),
			series: series(),
			legend: legend(),
			label: label(measures.value.measures),
			grid: grid(),
			dataset: dataset(),
			visualMap: visualMap(),
		}
	},
	{ deep: true },
)
</script>

<!-- <template>
	<div class="report-column">
		<div
			ref="id"
			class="size-full pb-4"
			:style="{ height }"
		/>
	</div>
</template>

<script setup lang="ts">
import useFormatValue from '@/composables/useFormatValue'
import { Scatter, type ScatterOptions } from '@antv/g2plot'
import type { ReportNodeType } from '@gaio/shared/types'
import { computed, nextTick } from 'vue'
import { onMounted, shallowRef } from 'vue'
import useReportChartHelper from './ReportChartHelperGplot'

defineEmits(['change'])
const { task, list, height } = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()

const chartHelper = computed(() => useReportChartHelper(task, list))
const {
	dimensions,
	measures,
	settings,
	columnName,
	processedList,
	firstMeasure,
	firstDimension,
	thirdMeasure,
	secondMeasure,
	label,
} = chartHelper.value

const id = shallowRef()
const chart = shallowRef<Scatter>()
const { formatValue } = useFormatValue()

const sizeField = columnName(thirdMeasure.value) || columnName(firstMeasure.value)

const xBaseline = () => {
	const quadrantX = Number(settings.value.quadrantX)

	if (!isNaN(quadrantX) && quadrantX !== 0) {
		return quadrantX
	}

	const xMax = Math.max(...processedList('bubble').map((o) => o[columnName(firstMeasure.value)]))
	const xMin = Math.min(...processedList('bubble').map((o) => o[columnName(firstMeasure.value)]))
	return (xMax + xMin) / 2
}

const yBaseline = () => {
	const quadrantY = Number(settings.value.quadrantY)
	if (!isNaN(quadrantY) && quadrantY !== 0) {
		return quadrantY
	}
	const yMax = Math.max(...processedList('bubble').map((o) => o[columnName(secondMeasure.value)]))
	const yMin = Math.min(...processedList('bubble').map((o) => o[columnName(secondMeasure.value)]))
	return (yMax + yMin) / 2
}

const getOptions = (): ScatterOptions => {
	return {
		data: processedList('bubble'),
		xField: columnName(firstMeasure.value),
		yField: columnName(secondMeasure.value),
		color: settings.value.theme.colors,
		size: columnName(thirdMeasure.value) ? [4, 30] : [5, 5],
		shape: 'circle',
		sizeField,
		quadrant:
			settings.value.showQuadrant ?
				{
					xBaseline: xBaseline() ?? 0,
					yBaseline: yBaseline() ?? 0,
					labels: settings.value.quadrantContent
						.split('\n')
						.filter((i) => i)
						.map((content) => {
							return {
								content,
								style: {
									fill: '#999',
								},
							}
						}),
					regionStyle: settings.value.regionStyle.map((item) => {
						return {
							fill: item.fill,
							start: undefined,
							end: undefined,
						}
					}),
				}
			:	undefined,
		pointStyle:
			columnName(thirdMeasure.value) ?
				{
					fillOpacity: 0.7,
					stroke: '#bbb',
				}
			:	null,
		regressionLine:
			settings.value.guideScatterType && settings.value.guideScatterType !== 'none' ?
				{
					type: settings.value.guideScatterType,
				}
			:	null,

		// label: label(),
		label: label({
			formatter: (v: any) => {
				const valueOfV = v[columnName(firstMeasure.value)]
				return [
					formatValue(valueOfV, {
						...firstMeasure.value,
						compactNumber: settings.value.compactNumberLabel,
					}),
				]
			},
		}),

		tooltip: {
			showTitle: true,
			title: columnName(firstDimension.value),
			fields: measures.value.map((col) => columnName(col)),
		},
	}
}

const loadChart = () => {
	if (!id.value) return
	chart.value = new Scatter(id.value as HTMLElement, getOptions())
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
