<template>
	<VChart
		:style="{ height }"
		:option="option"
		autoresize
	/>
</template>

<script setup lang="ts">
import type { ReportNodeType } from '@gaio/shared/types'
import { HeatmapChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { GridComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import type {
	EChartsOption,
	HeatmapSeriesOption,
	VisualMapComponentOption,
	XAXisOption,
	YAXisOption,
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	HeatmapDataItemOption,
} from 'echarts/types/dist/shared'
import { ref } from 'vue'
import VChart from 'vue-echarts'
import useReportChartHelper from './helpers/ReportChartHelper'
import useReportChartHelperAxis from './helpers/ReportChartHelperAxis'
import useReportChartHelperLabel from './helpers/ReportChartHelperLabel'
import useReportChartHelperTicks from './helpers/ReportChartHelperTicks'

const { task, list, height } = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()

const { dimensions, measures, themeColors, settings, columnName } = computed(() => useReportChartHelper(task)).value
const { getMinMaxValues } = computed(() => useReportChartHelperTicks()).value
const { labelHeatmap } = computed(() => useReportChartHelperLabel(task)).value
const { commonXAxisConfigs, commonYAxisConfigs } = computed(() => useReportChartHelperAxis(task)).value
const { treatLabelsTicks } = computed(() => useReportChartHelperTicks()).value

use([CanvasRenderer, GridComponent, HeatmapChart, TitleComponent, TooltipComponent, LegendComponent])

const allMeasures = list.map((item) => {
	return item[columnName(measures.value.first)]
}) as number[]

const minMax = getMinMaxValues(allMeasures)

const visualMap = () => {
	const visualMap: VisualMapComponentOption = {
		show: settings.value.showLegend,
		min: minMax.min,
		max: minMax.max,
		type: 'piecewise',
		orient: 'horizontal',
		calculable: true,
		left: 'center',
		top: 'bottom',
		align: 'auto',
		inRange: {
			color: [themeColors.value[0], themeColors.value[1]],
		},
	}
	return visualMap
}

const series = () => {
	const data: HeatmapDataItemOption = list.map((item) => {
		return [
			item[columnName(dimensions.value.first)],
			item[columnName(dimensions.value.second)],
			item[columnName(measures.value.first)] as number,
		]
	})

	const serie: HeatmapSeriesOption = {
		type: 'heatmap',
		data: data,
	}
	return serie
}

const xAxis = () => {
	const values = list.map((item) => item[columnName(dimensions.value.first)]) as Array<number | string | Date>
	const ticksLabels = treatLabelsTicks(values, settings.value.xAxisTickCount)
	return {
		type: 'category',
		data: values,
		...commonXAxisConfigs(ticksLabels, columnName(dimensions.value.first)),
	} as XAXisOption | XAXisOption[]
}

const yAxis = () => {
	const values = list.map((item) => item[columnName(dimensions.value.second)]) as Array<number | string | Date>
	const ticksLabels = treatLabelsTicks(values, settings.value.yAxisTickCount)
	return {
		type: 'category',
		data: values,
		...commonYAxisConfigs(ticksLabels, columnName(dimensions.value.second)),
	} as YAXisOption | YAXisOption[]
}

const option = ref<EChartsOption>({
	tooltip: {
		formatter: (params: Record<string, any>) => {
			const xValue = params['value'][0]
			const yValue = params['value'][1]
			const value = params['value'][2]
			return `${xValue}` + `<br/>${yValue}` + `<br/>${value}`
		},
	},
	visualMap: visualMap(),
	series: series(),
	xAxis: xAxis(),
	yAxis: yAxis(),
	grid: {
		bottom: settings.value.showLegend ? '13%' : '10%',
		right: '3%',
		top: '3%',
	},
	label: labelHeatmap(),
})

watch(
	[() => task, () => list, dimensions, settings, measures, themeColors],
	() => {
		option.value = {
			...option.value,
			visualMap: visualMap(),
			series: series(),
			xAxis: xAxis(),
			yAxis: yAxis(),
			grid: {
				bottom: settings.value.showLegend ? '13%' : '10%',
				right: '3%',
				top: '3%',
			},
			label: labelHeatmap(),
		}
	},
	{ deep: true },
)
</script>
