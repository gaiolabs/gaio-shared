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
import { GaugeChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { GridComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption, GaugeSeriesOption } from 'echarts/types/dist/shared'
import { ref } from 'vue'
import VChart from 'vue-echarts'
import useReportChartHelper from './helpers/ReportChartHelper'
import useReportChartHelperLabel from './helpers/ReportChartHelperLabel'
import useReportChartHelperLegend from './helpers/ReportChartHelperLegend'

const { task, list, height } = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()

const { formatValue } = useFormatValue()
const { dimensions, measures, themeColors, settings, columnName } = computed(() => useReportChartHelper(task)).value
const { legend } = computed(() => useReportChartHelperLegend(task)).value
const { labelGauge } = computed(() => useReportChartHelperLabel(task)).value

use([CanvasRenderer, GridComponent, GaugeChart, TitleComponent, TooltipComponent, LegendComponent])

const grid = () => {
	return {
		top: (settings.value.appendPaddingTop ?? 0) + 3,
		bottom: (settings.value.appendPaddingBottom ?? 0) + 3,
		left: (settings.value.appendPaddingLeft ?? 0) + 3,
		right: (settings.value.appendPaddingRight ?? 0) + 3,
		containLabel: true,
	}
}

const calculateCenter = () => {
	const x = grid().left - grid().right
	const y = grid().top - grid().bottom
	return [`${x + 50}%`, `${y + 70}%`]
}

const calculateRadius = () => {
	const radius = 140 - grid().top - grid().bottom - grid().left - grid().right
	return radius.toString() + '%'
}

const series = () => {
	const values = list.map((item) => {
		return {
			min: item[columnName(measures.value.first)] as number,
			max: item[columnName(measures.value.second)] as number,
			target: item[columnName(measures.value.third)] as number,
			name: item[columnName(dimensions.value.first)] as string,
		}
	})

	const seriesOptions: GaugeSeriesOption | GaugeSeriesOption[] = [
		{
			type: 'gauge',
			center: calculateCenter(),
			radius: calculateRadius(),
			startAngle: 200,
			endAngle: -20,
			min: settings.value.showLabelPercent ? 0 : values[0].min,
			max: settings.value.showLabelPercent ? 100 : values[0].max,
			progress: {
				show: true,
				width: 30,
			},
			pointer: {
				show: settings.value.showPoint,
			},
			animation: false,
			color: themeColors.value,
			axisLabel: labelGauge(),
			anchor: {
				show: false,
			},
			title: {
				show: true,
				offsetCenter: settings.value.showPoint ? [0, '20%'] : [0, '-20%'],
				fontSize: 20,
				color: '#000',
			},
			detail: {
				valueAnimation: true,
				width: '60%',
				lineHeight: 40,
				borderRadius: 8,
				offsetCenter: settings.value.showPoint ? [0, '30%'] : [0, '0%'],
				fontSize: 20,
				fontWeight: 'bolder',
				color: 'inherit',
				formatter: (v: number) => {
					const formatedValue = formatValue(v, {
						compactNumber: settings.value.compactNumberLabel,
					})
					return settings.value.showLabelPercent ? formatedValue.toString() + '%' : formatedValue.toString()
				},
			},
			data: [
				{
					value:
						settings.value.showLabelPercent ?
							(Math.abs(values[0].target) / Math.abs(values[0].max)) * 100
						:	values[0].target,
					name: values[0].name,
				},
			],
		},
	]
	return seriesOptions
}

const option = ref<EChartsOption>({
	// tooltip: {
	// 	trigger: 'item',
	// },
	series: series(),
	legend: legend(),
})

watch(
	[() => task, () => list, dimensions, measures, themeColors],
	() => {
		option.value = {
			...option.value,
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
