<template>
	<div class="report-column">
		<div
			ref="id"
			class="size-full pb-4"
			:style="{ height }"
		/>
	</div>
</template>

<script setup lang="ts">
import useFormatValue from '@/composables/useFormatValue'
import { Scatter, type ScatterOptions } from '@antv/g2plot'
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
	columnName,
	processedList,
	firstMeasure,
	firstDimension,
	thirdMeasure,
	secondMeasure,
	label,
} = chartHelper.value

const id = shallowRef()
const chart = shallowRef<Scatter>()
const { formatValue } = useFormatValue()

const xBaseline = () => {
	const quadrantX = Number(settings.value.quadrantX)

	if (!isNaN(quadrantX) && quadrantX !== 0) {
		return quadrantX
	}

	const xMax = Math.max(...processedList('scatter').map((o) => o[columnName(firstMeasure.value)]))

	const xMin = Math.min(...processedList('scatter').map((o) => o[columnName(firstMeasure.value)]))
	return (xMax + xMin) / 2
}

const yBaseline = () => {
	const quadrantY = Number(settings.value.quadrantY)
	if (!isNaN(quadrantY) && quadrantY !== 0) {
		return quadrantY
	}
	const yMax = Math.max(...processedList('scatter').map((o) => o[columnName(secondMeasure.value)]))

	const yMin = Math.min(...processedList('scatter').map((o) => o[columnName(secondMeasure.value)]))
	return (yMax + yMin) / 2
}

const getOptions = (): ScatterOptions => {
	return {
		data: processedList('scatter'),
		xField: columnName(firstMeasure.value),
		yField: columnName(secondMeasure.value),
		color: settings.value.theme.colors,
		size: columnName(thirdMeasure.value) ? [4, 30] : [5, 5],
		shape: 'circle',
		quadrant:
			settings.value.showQuadrant ?
				{
					xBaseline: xBaseline() ?? 0,
					yBaseline: yBaseline() ?? 0,
					labels: settings.value.quadrantContent
						.split('\n')
						.filter((i) => i)
						.map((content) => {
							return {
								content,
								style: {
									fill: '#999',
								},
							}
						}),
					regionStyle: settings.value.regionStyle.map((item) => {
						return {
							fill: item.fill,
							start: undefined,
							end: undefined,
						}
					}),
				}
			:	undefined,
		pointStyle:
			columnName(thirdMeasure.value) ?
				{
					fillOpacity: 0.7,
					stroke: '#bbb',
				}
			:	null,
		regressionLine:
			settings.value.guideScatterType && settings.value.guideScatterType !== 'none' ?
				{
					type: settings.value.guideScatterType,
				}
			:	null,

		label: label({
			formatter: (v: any) => {
				const valueOfV = v[columnName(firstMeasure.value)]
				return [
					formatValue(valueOfV, {
						...firstMeasure.value,
						compactNumber: settings.value.compactNumberLabel,
					}),
				]
			},
		}),
		tooltip: {
			showTitle: true,
			title: columnName(firstDimension.value),
			fields: measures.value.map((col) => columnName(col)),
		},
	}
}

const loadChart = () => {
	if (!id.value) return
	chart.value = new Scatter(id.value as HTMLElement, getOptions())
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
</script>
