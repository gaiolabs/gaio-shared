<template>
	<div class="report-column">
		<div
			ref="id"
			class="size-full"
			:style="{ height }"
		/>
	</div>
</template>

<script setup lang="ts">
import { fold } from '@/views/report/report-chart/fold'
import { Column, type ColumnOptions } from '@antv/g2plot'
import type { ReportNodeType } from '@gaio/shared/types'
import { sumBy } from 'lodash-es'
import { computed, nextTick } from 'vue'
import { onMounted, shallowRef } from 'vue'
import useReportChartHelper from './ReportChartHelper'

defineEmits(['change'])
const { task, list, height } = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()

const chartHelper = computed(() => useReportChartHelper(task))
const { dimensions, measures, settings, columnName, themeColors, foundation } = chartHelper.value

const id = shallowRef()
const chart = shallowRef()
const localList = shallowRef([])

const isMultipleMeasure = computed(() => {
	return task.schema.select.filter((o) => o.type !== 'value').length > 1
})

const isGrouped = computed(() => {
	return task.schema.select.filter((o) => o.type === 'value').length > 1
})

const total = computed(() => {
	return sumBy(localList.value, (o) => {
		return o[columnName(measures.value[0])] ? o[columnName(measures.value[0])] : 0
	})
})

const loadChart = () => {
	let common = {} as Partial<Record<string, unknown>>
	if (!isGrouped.value && isMultipleMeasure.value) {
		common.isGroup = true
		common.xField = columnName(dimensions.value[0])
		common.yField = 'measure'
		common.seriesField = 'category'
		// common.dodgePadding = 0
		// common.intervalPadding = 20
	} else if (isGrouped.value) {
		common.isGroup = true
		common.xField = columnName(dimensions.value[0])
		common.yField = columnName(measures.value[0])
		common.seriesField = columnName(dimensions.value[1])
		// common.dodgePadding = 0
		// common.intervalPadding = 20
	} else {
		common.xField = columnName(dimensions.value[0])
		common.yField = columnName(measures.value[0])
	}
	// common.padding = appendPadding()

	chart.value = new Column(
		id.value as HTMLElement,
		{
			data: localList.value,
			...common,
			color:
				isGrouped.value || isMultipleMeasure.value ? themeColors.value
				: settings.value.showLegend ? themeColors.value
				: themeColors.value[0],

			...foundation.value,
			label: chartHelper.value.linearLabel(total.value),
			columnBackground:
				settings.value.columnBackground ?
					{
						style: {
							fill: 'rgba(0,0,0,0.08)'
						}
					}
				:	undefined
		} as ColumnOptions
	)
	chart.value.render()
}

onMounted(() => {
	let data = list

	if (isGrouped.value || !isMultipleMeasure.value) {
		localList.value = data
	} else {
		localList.value = fold(data, measures.value)
	}

	nextTick(() => loadChart())
})
</script>
