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
import type { EChartsOption, SunburstSeriesOption } from 'echarts/types/dist/shared'
import { ref } from 'vue'
import VChart from 'vue-echarts'
import useReportChartHelper from './helpers/ReportChartHelper'
import useReportChartHelperLabel from './helpers/ReportChartHelperLabel'

const { task, list, height } = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()

const { dimensions, measures, themeColors, settings, columnName } = computed(() => useReportChartHelper(task)).value
const { labelSunburst } = computed(() => useReportChartHelperLabel(task)).value

use([CanvasRenderer, GridComponent, BarChart, TitleComponent, TooltipComponent, LegendComponent])

const data = () => {
	const root = { name: 'root', children: [] }

	list.forEach((item) => {
		let currentLevel = root
		dimensions.value.dimensions.forEach((dim, index) => {
			const dimensionValue = item[columnName(dim)]
			let existingDimension = currentLevel.children.find((child) => child.name === dimensionValue)

			if (!existingDimension) {
				if (dimensions.value.dimensions.length - 1 > index) {
					existingDimension = {
						name: dimensionValue,
						children: [],
					}
				} else {
					existingDimension = {
						name: dimensionValue,
						value: item[columnName(measures.value.first)],
					}
				}
				currentLevel.children.push(existingDimension)
			}
			currentLevel = existingDimension
		})
	})
	return root
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
	const radius = 100 - grid().top - grid().bottom - grid().left - grid().right
	return [30, radius.toString() + '%']
}

const series = () => {
	return {
		type: 'sunburst',
		data: data().children,
		center: calculateCenter(),
		radius: calculateRadius(),
		label: labelSunburst(),
	} as SunburstSeriesOption | SunburstSeriesOption[]
}

const option = ref<EChartsOption>({
	tooltip: {
		trigger: 'item',
	},
	color: themeColors.value,
	series: series(),
})

watch(
	[() => task, () => list, dimensions, measures, themeColors],
	() => {
		option.value = {
			...option.value,
			color: themeColors.value,
			series: series(),
		}
	},
	{ deep: true },
)
</script>

<!-- <template>
	<div class="report-donut">
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
		data: processedList('donut'),
		colorField: columnName(firstDimension.value),
		angleField: columnName(firstMeasure.value),
		radius: 1,
		innerRadius: settings.value.innerRadius || 0.72,
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
		statistic:
			settings.value.showStatistic ?
				{
					title:
						settings.value.statisticLabel ?
							{
								offsetY: -4,
								customHtml: () => {
									return settings.value.statisticLabel
								},
								style: {
									fontSize: Number(settings.value.statisticFontSize || 20) + 'px',
									fill: settings.value.statisticFontColor || '#333',
									whiteSpace: 'pre-wrap',
									overflow: 'hidden',
									textOverflow: 'ellipsis'
								}
							}
						:	false,
					content: {
						offsetY: 4,
						style: {
							fontSize: Number(settings.value.statisticFontSize || 20) + 'px',
							fill: settings.value.statisticFontColor || '#333',
							whiteSpace: 'pre-wrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis'
						},
						formatter: (datum, data) =>
							datum ?
								`${formatValue(datum[columnName(firstMeasure.value)], {
									...firstMeasure.value,
									compactNumber: settings.value.compactNumberStatistic
								})}`
							:	`${formatValue(
									data.reduce((r, d) => r + d[columnName(firstMeasure.value)], 0),
									{
										...firstMeasure.value,
										compactNumber: settings.value.compactNumberStatistic
									}
								)}`
					}
				}
			:	null,
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
