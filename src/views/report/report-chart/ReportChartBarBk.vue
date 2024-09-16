<template>
	<div class="report-bar">
		<div
			ref="id"
			class="h-full w-full"
			:style="{ height }"
		/>
	</div>
</template>

<script setup lang="ts">
import { Bar, type BarOptions } from '@antv/g2plot'
import type { ReportNodeType } from '@gaio/shared/types'
import { sumBy } from 'lodash-es'
import { computed, nextTick } from 'vue'
import { onMounted, shallowRef } from 'vue'
import { fold } from './fold'
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
	linearLabel
} = chartHelper.value

const total = computed(() => {
	return sumBy(processedList('column'), (o) => {
		return o[columnName(measures.value[0])] ? o[columnName(measures.value[0])] : 0
	})
})

const id = shallowRef()
const chart = shallowRef()

const getOptions = (): BarOptions => {
	return {
		data: processedList('column'),
		yField: columnName(firstDimension.value),
		xField: !isGrouped.value && isMultipleMeasure.value ? 'measure' : columnName(firstMeasure.value),
		seriesField:
			isGrouped.value && !isMultipleMeasure.value ? columnName(secondDimension.value)
			: isMultipleMeasure.value ? 'category'
			: settings.value.showLegend ? columnName(firstDimension.value)
			: undefined,
		...foundation.value,
		// isGroup: true,
		isGroup: isGrouped.value || isMultipleMeasure.value,
		color:
			isGrouped.value || isMultipleMeasure.value ? themeColors.value
			: settings.value.showLegend ? themeColors.value
			: themeColors.value[0],
		label: chartHelper.value.linearLabel(total.value),
		...foundation.value,
		yAxis: {
			title:
				settings.value.showYTitle ?
					{
						style: {
							fill: 'rgba(0,0,0,0.45)'
						}
					}
				:	null,
			grid:
				settings.value.showYGrid ?
					{
						line: {
							style: {
								stroke: 'rgba(0,0,0,0.08)'
							}
						}
					}
				:	null
		},
		xAxis: {
			title:
				settings.value.showXTitle ?
					{
						style: {
							lineWidth: 0,
							fill: 'rgba(0,0,0,0.45)'
						}
					}
				:	null,
			grid:
				settings.value.showXGrid ?
					{
						line: {
							style: {
								stroke: 'rgba(0,0,0,0.08)'
							}
						}
					}
				:	null
		},
		barBackground:
			settings.value.columnBackground ?
				{
					style: {
						fill: 'rgba(0,0,0,0.08)'
					}
				}
			:	undefined
	}
}
const loadChart = () => {
	if (!id.value) return
	chart.value = new Bar(id.value as HTMLElement, getOptions())
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
