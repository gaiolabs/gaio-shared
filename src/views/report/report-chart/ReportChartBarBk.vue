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
import { fold } from '@/views/report/report-chart/fold'
import { Bar, type BarOptions } from '@antv/g2plot'
import type { ReportNodeType } from '@gaio/shared/types'
import { sumBy } from 'lodash-es'
import { computed, nextTick } from 'vue'
import { onMounted, shallowRef } from 'vue'
import useReportChartHelper from './ReportChartHelper'

defineEmits(['change'])
const props = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()

const chartHelper = computed(() => useReportChartHelper(props.task))
const { dimensions, measures, settings, columnName, themeColors, foundation } = chartHelper.value

const total = computed(() => {
	return sumBy(localList.value, (o) => {
		return o[columnName(measures.value[0])] ? o[columnName(measures.value[0])] : 0
	})
})

const id = shallowRef()
const chart = shallowRef()
const localList = shallowRef([])

const isMultipleMeasure = computed(() => {
	return props.task.schema.select.filter((o) => o.type !== 'value').length > 1
})

const isGrouped = computed(() => {
	return props.task.schema.select.filter((o) => o.type === 'value').length > 1
})

const loadChart = () => {
	let common = {} as Partial<Record<string, unknown>>
	if (!isGrouped.value && isMultipleMeasure.value) {
		common.isGroup = true
		common.yField = columnName(dimensions.value[0])
		common.xField = 'measure'
		common.seriesField = 'category'
		common.dodgePadding = 0
	} else if (isGrouped.value) {
		common.isGroup = true
		common.yField = columnName(dimensions.value[0])
		common.xField = columnName(measures.value[0])
		common.seriesField = columnName(dimensions.value[1])
		common.dodgePadding = 0
	} else {
		common.yField = columnName(dimensions.value[0])
		common.xField = columnName(measures.value[0])
	}

	chart.value = new Bar(
		id.value as HTMLElement,
		{
			data: localList.value,
			...common,
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
		} as BarOptions
	)
	chart.value.render()
}

onMounted(() => {
	let data = props.list

	if (isGrouped.value || !isMultipleMeasure.value) {
		localList.value = data
	} else {
		localList.value = fold(data, measures.value)
	}

	nextTick(() => loadChart())
})
</script>
