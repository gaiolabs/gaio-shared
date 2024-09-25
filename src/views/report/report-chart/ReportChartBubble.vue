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

const firstDimensionsData = [
	...new Set(
		list.map((item) => {
			return item[columnName(dimensions.value.first)]
		}),
	),
]

const treatedData = list.map((item) => {
	return [
		item[columnName(measures.value.first)],
		item[columnName(measures.value.second)],
		item[columnName(measures.value.third)],
		item[columnName(dimensions.value.second)],
		item[columnName(dimensions.value.first)],
	]
})

const visualMap = () => {
	return {
		show: false,
		dimension: 2,
		min: 20000,
		max: 1500000000,
		seriesIndex: [0, 1],
		inRange: {
			symbolSize: [100, 1000],
		},
	} as VisualMapComponentOption
}

const series = () => {
	const serieData = firstDimensionsData.map((item, index) => {
		return {
			name: item,
			type: 'scatter',
			datasetIndex: index + 1,
			markLine: markLine(xMinMax, yMinMax),
			markArea: markArea(xMinMax, yMinMax),
		}
	})
	const valuesX = list.map((item) => item[columnName(measures.value.first)]) as Array<number | string | Date>
	const xMinMax = getMinMaxValues(valuesX)
	const valuesY = list.map((item) => item[columnName(measures.value.second)]) as Array<number | string | Date>
	const yMinMax = getMinMaxValues(valuesY)

	console.log('serieData', serieData)
	return [
		...serieData,
		{
			// colorBy: 'data',
			markLine: markLine(xMinMax, yMinMax),
			markArea: markArea(xMinMax, yMinMax),
		},
		{
			name: 'line',
			type: 'line',
			smooth: true,
			datasetIndex: 3,
			symbolSize: 0.1,
			symbol: 'circle',
			label: { show: false, fontSize: 16 },
			labelLayout: { dx: -20 },
			encode: { label: 2, tooltip: 1 },
		},
	] as SeriesOption | SeriesOption[]
}

const dataset = () => {
	const transformData = firstDimensionsData.map((item) => {
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

	return [
		{
			source: treatedData,
		},
		...transformData,
		settings.value.guideScatterType && settings.value.guideScatterType !== 'none' ?
			{
				transform: {
					type: 'ecStat:regression',
					config: {
						method: settings.value.guideScatterType ?? 'linear',
						formulaOn: 'start',
					},
				},
			}
		:	null,
	] as DatasetOption
}

const option = ref<EChartsOption>(null)
onMounted(() => {
	nextTick(() => {
		option.value = {
			dataset: dataset(),
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
				},
			},
			color: themeColors.value,
			legend: legend(),
			label: label(measures.value.measures),
			grid: grid(),
			xAxis: xAxis(),
			yAxis: yAxis(),
			series: series(),
			visualMap: visualMap(),
		}
	})
})

watch(
	[() => task, () => list, dimensions, measures, themeColors],
	() => {
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
