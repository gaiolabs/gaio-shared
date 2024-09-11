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
import { onMounted, shallowRef, watch } from 'vue'
import useReportChartHelper from './ReportChartHelper'

defineEmits(['change'])
const { task, list, height } = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()

const chartHelper = computed(() => useReportChartHelper(task))
const { dimensions, measures, settings, foundation, columnName, linearLabel } = chartHelper.value

const id = shallowRef()
const chart = shallowRef<Funnel>()
const localList = shallowRef([])

const total = computed(() => sumBy(localList.value, columnName(measures.value[0])) || 0)

const processLocalList = () => {
	const dimension = columnName(dimensions.value[0])
	const measure = columnName(measures.value[0])
	localList.value = list
		.map((item) => ({ [dimension]: item[dimension], [measure]: item[measure] }))
		.sort((a, b) => (a[measure] > b[measure] ? -1 : 1))
}

const getFunnelOptions = (): FunnelOptions => {
	return {
		data: localList.value,
		xField: columnName(dimensions.value[0]),
		yField: columnName(measures.value[0]),
		isTransposed: settings.value.transposed ?? false,
		dynamicHeight: true,
		conversionTag: false,
		label: linearLabel(total.value),
		...foundation.value
	}
}

const loadChart = () => {
	if (!id.value) return
	chart.value = new Funnel(id.value as HTMLElement, getFunnelOptions())
	chart.value.render()
}

watch(
	[dimensions, measures, list, task.settings],
	() => {
		processLocalList()
		chart.value.update(getFunnelOptions())
	},
	{ deep: true }
)

onMounted(() => {
	processLocalList()
	nextTick(() => loadChart())
})
</script>
