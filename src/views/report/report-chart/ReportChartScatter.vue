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
import { Scatter, type ScatterOptions } from '@antv/g2plot'
import type { ReportNodeType } from '@gaio/shared/types'
import { sumBy } from 'lodash-es'
import { computed, nextTick } from 'vue'
import { onMounted, shallowRef } from 'vue'
import { fold } from './fold'
import useReportChartHelper from './ReportChartHelper'

defineEmits(['change'])
const { task, list, height } = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()

const chartHelper = computed(() => useReportChartHelper(task, list))
const { dimensions, measures, settings, columnName, foundation, themeColors } = chartHelper.value

const id = shallowRef()
const chart = shallowRef<Scatter>()
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
	} else if (isGrouped.value) {
		common.isGroup = true
		common.xField = columnName(dimensions.value[0])
		common.yField = columnName(measures.value[0])
		common.seriesField = columnName(dimensions.value[1])
	} else {
		common.xField = columnName(dimensions.value[0])
		common.yField = columnName(measures.value[0])
	}

	chart.value = new Scatter(
		id.value as HTMLElement,
		{
			data: localList.value,
			...common,
			appendPadding: [10, 10, 10, 10],
			xField: 'xG conceded',
			yField: 'Shot conceded',
			color:
				isGrouped.value || isMultipleMeasure.value ? themeColors.value
				: settings.value.showLegend ? themeColors.value
				: themeColors.value[0],

			...foundation.value,
			label: chartHelper.value.linearLabel(total.value)
		} as ScatterOptions
	)
	chart.value.render()
}

onMounted(() => {
	let data = list
	if (isGrouped.value || !isMultipleMeasure.value) {
		localList.value = data.sort((a, b) =>
			a.sum_profitEach > b.sum_profitEach ? -1
			: a.sum_profitEach < b.sum_profitEach ? 1
			: 0
		)
	} else {
		localList.value = fold(data, measures.value).sort((a, b) =>
			a.sum_profitEach > b.sum_profitEach ? -1
			: a.sum_profitEach < b.sum_profitEach ? 1
			: 0
		)
	}

	nextTick(() => loadChart())
})
</script>
