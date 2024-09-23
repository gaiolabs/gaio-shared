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

const { dimensions, measures, settings, columnName } = computed(() => useReportChartHelper(task)).value
const { commonXAxisConfigs, commonYAxisConfigs } = computed(() => useReportChartHelperAxis(task)).value
const { grid } = computed(() => useReportChartHelperGrid(task)).value
const { legend } = computed(() => useReportChartHelperLegend(task)).value
const { label } = computed(() => useReportChartHelperLabel(task)).value
const { treatLabelsTicks } = computed(() => useReportChartHelperTicks()).value

use([CanvasRenderer, GridComponent, BarChart, TitleComponent, TooltipComponent, LegendComponent])

const xAxis = () => {
	const values = measures.value.measures
		.map((measure) => {
			return list.map((item) => {
				return item[columnName(measure)]
			})
		})
		.flat(Infinity) as Array<number | string | Date>

	const ticksLabels = treatLabelsTicks(values, settings.value.xAxisTickCount)
	return {
		type: 'value',
		...commonXAxisConfigs(ticksLabels, columnName(measures.value.first)),
	} as XAXisOption | XAXisOption[]
}

const yAxis = () => {
	const values = list.map((item) => {
		return item[columnName(dimensions.value.first)]
	}) as Array<number | string | Date>

	const ticksLabels = treatLabelsTicks(values, settings.value.yAxisTickCount)
	return {
		type: 'category',
		data: values,
		...commonYAxisConfigs(ticksLabels, columnName(dimensions.value.first)),
	} as YAXisOption | YAXisOption[]
}

const series = () => {
	return measures.value.measures.map((measure) => {
		const values = list.map((item) => item[columnName(measure)])
		return {
			name: columnName(measure),
			type: 'bar',
			emphasis: {
				focus: 'series',
			},
			data: values,
		}
	}) as SeriesOption | SeriesOption[]
}

const option = ref<EChartsOption>({
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'shadow',
		},
	},
	legend: legend(),
	label: label(measures.value.measures),
	grid: grid(),
	xAxis: xAxis(),
	yAxis: yAxis(),
	series: series(),
})

watch(
	[() => task, () => list, dimensions, measures],
	() => {
		option.value = {
			...option.value,
			xAxis: xAxis(),
			yAxis: yAxis(),
			series: series(),
			legend: legend(),
			label: label(measures.value.measures),
			grid: grid(),
		}
	},
	{ deep: true },
)
</script>

<!-- <template>
	<div class="report-bar">
		<div
			ref="id"
			class="h-full w-full"
			:style="{ height }"
		/>
	</div>
</template>

<script setup lang="ts">
import { Bar, type BarOptions } from '@antv/g2plot'
import type { ReportNodeType } from '@gaio/shared/types'
import { sumBy } from 'lodash-es'
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
	foundation,
	columnName,
	processedList,
	themeColors,
	isGrouped,
	isMultipleMeasure,
	firstMeasure,
	firstDimension,
	secondDimension,
} = chartHelper.value

const total = computed(() => {
	return sumBy(processedList('column'), (o) => {
		return o[columnName(measures.value[0])] ? o[columnName(measures.value[0])] : 0
	})
})

const id = shallowRef()
const chart = shallowRef()

const getOptions = (): BarOptions => {
	return {
		data: processedList('bar'),
		yField: columnName(firstDimension.value),
		xField: !isGrouped.value && isMultipleMeasure.value ? 'measure' : columnName(firstMeasure.value),
		seriesField:
			isGrouped.value && !isMultipleMeasure.value ? columnName(secondDimension.value)
			: isMultipleMeasure.value ? 'category'
			: settings.value.showLegend ? columnName(firstDimension.value)
			: undefined,
		...foundation.value,
		isGroup: isGrouped.value || isMultipleMeasure.value,
		color:
			isGrouped.value || isMultipleMeasure.value ? themeColors.value
			: settings.value.showLegend ? themeColors.value
			: themeColors.value[0],
		label: chartHelper.value.linearLabel(total.value),
		...foundation.value,
		yAxis: {
			title:
				settings.value.showYTitle ?
					{
						style: {
							fill: 'rgba(0,0,0,0.45)',
						},
					}
				:	null,
			grid:
				settings.value.showYGrid ?
					{
						line: {
							style: {
								stroke: 'rgba(0,0,0,0.08)',
							},
						},
					}
				:	null,
		},
		xAxis: {
			title:
				settings.value.showXTitle ?
					{
						style: {
							lineWidth: 0,
							fill: 'rgba(0,0,0,0.45)',
						},
					}
				:	null,
			grid:
				settings.value.showXGrid ?
					{
						line: {
							style: {
								stroke: 'rgba(0,0,0,0.08)',
							},
						},
					}
				:	null,
		},
		barBackground:
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
	chart.value = new Bar(id.value as HTMLElement, getOptions())
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
