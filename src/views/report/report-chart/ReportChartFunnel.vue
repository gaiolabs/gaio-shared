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
import { fold } from '@/views/report/report-chart/fold'
import { Funnel, type FunnelOptions } from '@antv/g2plot'
import type { ReportNodeType } from '@gaio/shared/types'
import { sumBy } from 'lodash-es'
import { computed, nextTick } from 'vue'
import { onMounted, shallowRef } from 'vue'
import useReportChartHelper from './ReportChartHelper'

defineEmits(['change'])
const { task, list, height } = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()

const chartHelper = computed(() => useReportChartHelper(task))
const { dimensions, measures, settings, columnName, foundation } = chartHelper.value

const id = shallowRef()
const chart = shallowRef<Funnel>()
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

	chart.value = new Funnel(
		id.value as HTMLElement,
		{
			data: localList.value,
			isTransposed: settings.value.transposed ?? false,
			dynamicHeight: true,
			conversionTag: false,
			...common,
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
		} as FunnelOptions
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
