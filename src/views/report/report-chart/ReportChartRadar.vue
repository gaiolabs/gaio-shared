<template>
	<VChart
		id="ReportChartRadar"
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
import type { EChartsOption, RadarOption, RadarSeriesOption } from 'echarts/types/dist/shared'
import { ref } from 'vue'
import VChart from 'vue-echarts'
import useReportChartHelper from './helpers/ReportChartHelper'
import useReportChartHelperLabel from './helpers/ReportChartHelperLabel'
import useReportChartHelperLegend from './helpers/ReportChartHelperLegend'
import useReportChartHelperTicks from './helpers/ReportChartHelperTicks'

const { task, list, height } = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()

const { dimensions, measures, themeColors, columnName, settings } = computed(() => useReportChartHelper(task)).value
const { legend } = computed(() => useReportChartHelperLegend(task)).value
const { labelRadar } = computed(() => useReportChartHelperLabel(task)).value
const { getMinMaxValues } = computed(() => useReportChartHelperTicks()).value

use([CanvasRenderer, GridComponent, BarChart, TitleComponent, TooltipComponent, LegendComponent])

const series = () => {
	const data = measures.value.measures.map((measure) => {
		const values = list.map((item) => {
			return item[columnName(measure)]
		})
		return {
			value: values,
			name: columnName(measure),
		}
	})

	return [
		{
			type: 'radar',
			tooltip: {
				trigger: 'item',
			},
			areaStyle: {},
			data: data,
		},
	] as RadarSeriesOption | RadarSeriesOption[]
}

const radar = () => {
	const allMeasures = [
		...new Set(
			list.flatMap((item) => {
				return measures.value.measures.map((measure) => {
					return item[columnName(measure)]
				}) as number[]
			}),
		),
	]

	const minMax = getMinMaxValues(allMeasures)
	const values = list.map((item) => {
		return {
			name: item[columnName(dimensions.value.first)],
			max: minMax.max,
			alignTicks: false,
		}
	})
	return [
		{
			shape: 'circle',
			indicator: values,
			center: calculateCenter(),
			radius: calculateRadius(),
		},
	] as RadarOption[]
}

const grid = () => {
	const positions = settings.value.legendPosition.split('-')
	const isTopOrBottom = positions.includes('top') || positions.includes('bottom')

	const plusLegendTop = settings.value.showLegend && positions.includes('top') ? 10 : 0
	const plusLegendBottom = settings.value.showLegend && positions.includes('bottom') ? 10 : 0
	const plusLegendLeft = settings.value.showLegend && positions.includes('left') && !isTopOrBottom ? 15 : 0
	const plusLegendRight = settings.value.showLegend && positions.includes('right') && !isTopOrBottom ? 15 : 0

	const plusTitleBottom = settings.value.showXTitle ? 5 : 0
	const plusTitleLeft = settings.value.showYTitle ? 3 : 0

	return {
		top: (settings.value.appendPaddingTop ?? 0) + plusLegendTop + 3,
		bottom: (settings.value.appendPaddingBottom ?? 0) + plusLegendBottom + plusTitleBottom + 3,
		left: (settings.value.appendPaddingLeft ?? 0) + plusLegendLeft + plusTitleLeft + 3,
		right: (settings.value.appendPaddingRight ?? 0) + plusLegendRight + 3,
		containLabel: true,
	}
}

const calculateCenter = () => {
	const x = grid().left - grid().right
	const y = grid().top - grid().bottom
	return [`${x + 50}%`, `${y + 50}%`]
}

const calculateRadius = () => {
	const radius = 85 - grid().top - grid().bottom - grid().left - grid().right
	return radius.toString() + '%'
}

const option = ref<EChartsOption>({
	tooltip: {
		trigger: 'axis',
	},
	color: themeColors.value,
	radar: radar(),
	series: series(),
	legend: legend(),
	label: labelRadar(),
})

watch(
	[() => task, () => list, dimensions, measures, themeColors],
	() => {
		option.value = {
			...option.value,
			color: themeColors.value,
			radar: radar(),
			series: series(),
			legend: legend(),
			label: labelRadar(),
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
