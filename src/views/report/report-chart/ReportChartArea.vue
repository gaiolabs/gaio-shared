<template>
	<VChart
		id="ReportChartArea"
		:style="{ height }"
		:option="option"
		autoresize
	/>
</template>

<script setup lang="ts">
import type { ReportNodeType } from '@gaio/shared/types'
import { LineChart } from 'echarts/charts'
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

use([CanvasRenderer, GridComponent, LineChart, TitleComponent, TooltipComponent, LegendComponent])

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
	const values = measures.value.measures
		.map((measure) => {
			return list.map((item) => {
				return item[columnName(measure)]
			})
		})
		.flat(Infinity) as Array<number | string | Date>
	const ticksLabels = treatLabelsTicks(values, settings.value.yAxisTickCount)
	return {
		type: 'value',
		boundaryGap: false,
		...commonYAxisConfigs(ticksLabels, columnName(measures.value.first)),
	} as YAXisOption | YAXisOption[]
}

const series = () => {
	return measures.value.measures.map((measure) => {
		const values = list.map((item) => item[columnName(measure)])
		return {
			name: columnName(measure),
			data: values,
			type: 'line',
			emphasis: {
				focus: 'series',
			},
			smooth: settings.value.lineSmooth,
			symbol: settings.value.showPoint ? undefined : 'none',
			symbolSize: 10,
			areaStyle: {},
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
	color: themeColors.value,
	legend: legend(),
	label: label(measures.value.measures),
	grid: grid(),
	xAxis: xAxis(),
	yAxis: yAxis(),
	series: series(),
	areaStyle: {},
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
		}
	},
	{ deep: true },
)
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
import useFormatValue from '@/composables/useFormatValue'
import { Area, type AreaOptions } from '@antv/g2plot'
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
	themeColors,
	label,
	columnName,
	processedList,
	foundation,
	isGrouped,
	isMultipleMeasure,
	firstMeasure,
	firstDimension,
	secondDimension,
} = chartHelper.value

const { formatValue } = useFormatValue()
const id = shallowRef()
const chart = shallowRef()

const getOptions = (): AreaOptions => {
	return {
		data: processedList('area'),
		xField: columnName(firstDimension.value),
		yField: isGrouped.value || !isMultipleMeasure.value ? columnName(firstMeasure.value) : 'measure',
		seriesField:
			isGrouped.value && !isMultipleMeasure.value ? columnName(secondDimension.value)
			: isMultipleMeasure.value ? 'category'
			: undefined,
		...foundation.value,
		line: {
			size: settings.value.lineWidth || 1,
		},
		label: label({
			formatter:
				!settings.value.compactNumberLabel ?
					null
				:	(v: { [x: string]: never }) => {
						const value = v['measure'] || v[columnName(firstMeasure.value)]
						return formatValue(value, {
							compactNumber: settings.value.compactNumberLabel,
						})
					},
		}),
		smooth: settings.value.lineSmooth,
		point:
			settings.value.showPoint ?
				{
					shape: settings.value.pointType,
				}
			:	null,
		color:
			isGrouped.value || isMultipleMeasure.value ? themeColors.value
			: settings.value.showLegend ? themeColors.value
			: themeColors.value[0],
	}
}

const loadChart = () => {
	if (!id.value) return
	chart.value = new Area(id.value as HTMLElement, getOptions())
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
