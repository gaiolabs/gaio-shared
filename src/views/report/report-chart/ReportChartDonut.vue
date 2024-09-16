<template>
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
import useReportChartHelper from './ReportChartHelper'

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
	processedList
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
</script>
