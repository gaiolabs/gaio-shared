<template>
	<VChart
		id="ReportChartForecast"
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
import { useI18n } from 'vue-i18n'
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
const { treatLabelsTicks, getMinMaxValues } = computed(() => useReportChartHelperTicks()).value
const { t } = useI18n()

use([CanvasRenderer, GridComponent, BarChart, TitleComponent, TooltipComponent, LegendComponent])

const orderedList = list.sort(
	(a, b) =>
		new Date(a[columnName(dimensions.value.first)] as string).getTime() -
		new Date(b[columnName(dimensions.value.first)] as string).getTime(),
)

let dates: (string | null)[] = []
let realData: (number | null)[] = []
let forecastData: (number | null)[] = []
let bound: {
	lowerBound: number | null
	upperBound: number | null
}[] = []

const treateData = () => {
	dates = []
	realData = []
	forecastData = []
	bound = []

	orderedList.forEach((item) => {
		dates.push((item[columnName(dimensions.value.first)] as string) ?? null)
		realData.push((item[columnName(measures.value.first)] as number) ?? null)
		forecastData.push((item[columnName(measures.value.second)] as number) ?? null)
		if (item[columnName(measures.value.first)]) {
			bound.push({
				lowerBound: item[columnName(measures.value.second)] as number,
				upperBound: item[columnName(measures.value.second)] as number,
			})
		} else {
			bound.push({
				lowerBound: item[columnName(measures.value.third)] as number,
				upperBound: item[columnName(measures.value.fourth)] as number,
			})
		}
	})
}

const xAxis = () => {
	const ticksLabels = treatLabelsTicks(dates, settings.value.xAxisTickCount)
	return {
		type: 'category',
		data: dates,
		...commonXAxisConfigs(ticksLabels, columnName(dimensions.value.first)),
	} as XAXisOption | XAXisOption[]
}

const yAxis = () => {
	const ticksLabels = treatLabelsTicks(realData, settings.value.yAxisTickCount)
	const minMax = getMinMaxValues(
		list.map((item) => item[columnName(measures.value.first)]).filter((item) => item !== null) as Array<
			number | string | Date
		>,
	)
	return {
		type: 'value',
		min: minMax.minNotZero,
		max: minMax.maxNotZero,
		...commonYAxisConfigs(ticksLabels, columnName(measures.value.first)),
	} as YAXisOption | YAXisOption[]
}

// settings.value.forecastRealAsLine
const series = () => {
	return [
		{
			name: t('real'),
			type: 'line',
			data: realData,
			symbolSize: 6,
			roam: 'zoom',
			smooth: settings.value.lineSmooth,
			symbol: 'circle',
			lineStyle: {
				width: settings.value.forecastRealAsLine ? 3 : 0,
			},
		},
		{
			name: t('forecast'),
			type: 'line',
			data: forecastData,
			symbolSize: 6,
			smooth: settings.value.lineSmooth,
			symbol: settings.value.showPoint ? 'circle' : 'none',
			lineStyle: {
				type: 'none',
				width: 3,
			},
		},
		{
			name: t('lower'),
			type: 'line',
			data: bound.map((item) => {
				return item.lowerBound
			}),
			lineStyle: {
				opacity: 0,
			},
			stack: 'area',
			symbol: 'none',
		},
		{
			name: t('upper'),
			type: 'line',
			data: bound.map((item) => {
				return item.upperBound - item.lowerBound
			}),
			lineStyle: {
				opacity: 0,
			},
			areaStyle: {},
			stack: 'area',
			symbol: 'none',
		},
	] as SeriesOption | SeriesOption[]
}

treateData()
const option = ref<EChartsOption>({
	tooltip: {
		trigger: 'axis',
	},
	color: themeColors.value,
	legend: legend(),
	xAxis: xAxis(),
	yAxis: yAxis(),
	grid: grid(),
	series: series(),
	label: label(measures.value.measures),
})

watch(
	[() => task, () => list, dimensions, measures, themeColors],
	() => {
		treateData()
		option.value = {
			...option.value,
			color: themeColors.value,
			legend: legend(),
			xAxis: xAxis(),
			yAxis: yAxis(),
			grid: grid(),
			series: series(),
			label: label(measures.value.measures),
		}
	},
	{ deep: true },
)
</script>
