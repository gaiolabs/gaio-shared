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
		...commonYAxisConfigs(ticksLabels, columnName(measures.value.first)),
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
