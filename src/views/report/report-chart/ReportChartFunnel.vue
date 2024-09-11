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

const total = computed(() => {
	return sumBy(localList.value, (o) => {
		return o[columnName(measures.value[0])] ? o[columnName(measures.value[0])] : 0
	})
})

const loadChart = () => {
	chart.value = new Funnel(
		id.value as HTMLElement,
		{
			data: localList.value,
			xField: columnName(dimensions.value[0]),
			yField: columnName(measures.value[0]),
			isTransposed: settings.value.transposed ?? false,
			dynamicHeight: true,
			conversionTag: false,
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

watch([dimensions, measures], ([newDimensions, newMeasures]) => {
	const dimension = columnName(newDimensions[0])
	const measure = columnName(newMeasures[0])
	localList.value = list
		.map((item) => {
			return { [dimension]: item[dimension], [measure]: item[measure] }
		})
		.sort((a, b) =>
			a[measure] > b[measure] ? -1
			: a[measure] < b[measure] ? 1
			: 0
		)

	return chart.value.update({
		data: localList.value,
		xField: columnName(dimensions.value[0]),
		yField: columnName(measures.value[0]),
		isTransposed: settings.value.transposed ?? false,
		dynamicHeight: true,
		conversionTag: false,
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
	} as FunnelOptions)
})

onMounted(() => {
	const dimension = columnName(dimensions.value[0])
	const measure = columnName(measures.value[0])
	localList.value = list
		.map((item) => {
			return { [dimension]: item[dimension], [measure]: item[measure] }
		})
		.sort((a, b) =>
			a[measure] > b[measure] ? -1
			: a[measure] < b[measure] ? 1
			: 0
		)

	nextTick(() => loadChart())
})
</script>
