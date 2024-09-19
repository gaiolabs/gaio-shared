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
import { LineChart, FunnelChart, BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { GridComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import type {
	EChartsOption,
	XAXisOption,
	SeriesOption,
	LegendComponentOption,
	GridOption,
	YAXisOption,
} from 'echarts/types/dist/shared'
import { ref } from 'vue'
import VChart from 'vue-echarts'
import useReportChartHelper from './ReportChartHelper'

const { task, list, height } = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()

const { formatValue } = useFormatValue()
const chartHelper = computed(() => useReportChartHelper(task, list))
const { dimensions, measures, settings, columnName, themeColors, firstMeasure, firstDimension } = chartHelper.value

use([
	CanvasRenderer,
	GridComponent,
	BarChart,
	FunnelChart,
	LineChart,
	TitleComponent,
	TooltipComponent,
	LegendComponent,
])

const treatLabelsTicks = (arrayValues: Array<number | string | Date>, tickCount: number) => {
	let ticksLabels: Array<number | string | Date> = []
	const tickLabelLength = Math.ceil(arrayValues.length / (tickCount !== 0 ? tickCount : arrayValues.length))
	let i = 0
	arrayValues.forEach((value, index) => {
		if (index === 0) ticksLabels.push(value)
		if (tickLabelLength === i) {
			ticksLabels.push(value)
			i = 1
		} else i++
	})
	return ticksLabels
}

const xAxis = () => {
	const xValues = list.map((item) => item[columnName(firstDimension.value)]) as Array<number | string | Date>
	const ticksLabels = treatLabelsTicks(xValues, settings.value.xAxisTickCount)
	return {
		type: 'category',
		data: xValues,
		axisTick: {
			alignWithLabel: true,
			customValues: ticksLabels,
		},
		axisLine: {
			show: settings.value.showXLine,
		},
		splitLine: {
			show: settings.value.showXGrid,
		},
		name: settings.value.showXTitle ? columnName(firstDimension.value) : undefined,
		nameLocation: 'middle',
		nameTextStyle: {
			align: 'center',
			padding: [16, 0, 0, 0],
		},
		axisLabel: {
			show: settings.value.showXAxis,
			customValues: ticksLabels,
		},
	} as XAXisOption | XAXisOption[]
}

const yAxis = () => {
	const yValues = list.map((item) => item[columnName(firstMeasure.value)]) as Array<number | string | Date>
	const ticksLabels = treatLabelsTicks(yValues, settings.value.yAxisTickCount)

	return [
		{
			type: 'value',
			axisLine: {
				show: settings.value.showYLine,
			},
			splitLine: {
				show: settings.value.showYGrid,
			},
			name: settings.value.showYTitle ? columnName(firstMeasure.value) : undefined,
			nameLocation: 'center',
			nameTextStyle: {
				align: 'center',
				padding: [0, 0, 80, 0],
			},
			axisLabel: {
				show: settings.value.showYAxis,
				customValues: settings.value.yAxisTickCount === 0 ? undefined : ticksLabels,
			},
			axisTick: {
				alignWithLabel: false,
				customValues: settings.value.yAxisTickCount === 0 ? undefined : ticksLabels,
			},
		},
	] as YAXisOption | YAXisOption[]
}

const series = () => {
	return measures.value.map((measure) => {
		const yValues = list.map((item) => item[columnName(measure)])
		return {
			name: columnName(measure),
			type: 'bar',
			emphasis: {
				focus: 'series',
			},
			data: yValues,
		}
	}) as SeriesOption | SeriesOption[]
}

const legend = () => {
	const positions = settings.value.legendPosition.split('-')
	return {
		show: settings.value.showLegend,
		type: 'scroll',
		orient: positions.includes('top') || positions.includes('bottom') ? 'horizontal' : 'vertical',
		align: 'auto',
		top:
			positions.includes('top') ? 'top'
			: positions.includes('bottom') ? 'bottom'
			: 'center',
		left:
			positions.includes('left') ? 'left'
			: positions.includes('right') ? 'right'
			: 'center',
		textStyle: {
			color: settings.value.legendFontColor,
			fontSize: Number(settings.value.legendFontSize || 13),
		},
	} as LegendComponentOption | LegendComponentOption[]
}

const label = () => {
	return {
		show: settings.value.showLabel,
		position: settings.value.showLabelType,
		color: settings.value.labelFontColor,
		fontSize: settings.value.labelFontSize || 13,
		rotate: settings.value.labelRotate ? 90 : undefined,
		formatter: (v: Record<string, string | number | Date>) => {
			return formatValue(v['data'], {
				...firstMeasure.value,
				compactNumber: settings.value.compactNumberLabel,
			})
		},
	}
}

const grid = () => {
	const positions = settings.value.legendPosition.split('-')
	const isTopOrBottom = positions.includes('top') || positions.includes('bottom')

	const plusLegendTop = settings.value.showLegend && positions.includes('top') ? 10 : 0
	const plusLegendBottom = settings.value.showLegend && positions.includes('bottom') ? 10 : 0
	const plusLegendLeft = settings.value.showLegend && positions.includes('left') && !isTopOrBottom ? 15 : 0
	const plusLegendRight = settings.value.showLegend && positions.includes('right') && !isTopOrBottom ? 15 : 0

	const plusTitleBottom = settings.value.showXTitle ? 5 : 0
	// const plusTitleLeft = 0
	const plusTitleLeft = settings.value.showYTitle ? 3 : 0

	return {
		top: `${(settings.value.appendPaddingTop ?? 0) + plusLegendTop + 3}%`,
		bottom: `${(settings.value.appendPaddingBottom ?? 0) + plusLegendBottom + plusTitleBottom + 3}%`,
		left: `${(settings.value.appendPaddingLeft ?? 0) + plusLegendLeft + plusTitleLeft + 3}%`,
		right: `${(settings.value.appendPaddingRight ?? 0) + plusLegendRight + 3}%`,
		containLabel: true,
	} as GridOption | GridOption[]
}

const option = ref<EChartsOption>({
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'shadow',
		},
	},
	legend: legend(),
	label: label(),
	grid: grid(),
	// xAxis: yAxis(),
	// yAxis: xAxis(),
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
			label: label(),
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
