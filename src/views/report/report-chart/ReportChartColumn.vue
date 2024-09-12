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
import { Column, type ColumnOptions } from '@antv/g2plot'
import type { ReportNodeType } from '@gaio/shared/types'
import { sumBy } from 'lodash-es'
import { computed, nextTick } from 'vue'
import { onMounted, shallowRef, watch } from 'vue'
import { fold } from './fold'
import useReportChartHelper from './ReportChartHelper'

defineEmits(['change'])
const { task, list, height } = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()

const chartHelper = computed(() => useReportChartHelper(task))
const { dimensions, measures, settings, foundation, columnName, themeColors, isGrouped, isMultipleMeasure } =
	chartHelper.value

const id = shallowRef()
const chart = shallowRef<Column>()
const localList = shallowRef([])

const total = computed(() => sumBy(localList.value, columnName(measures.value[0])) || 0)

const processLocalList = () => {
	let data = list

	if (isGrouped.value || !isMultipleMeasure.value) {
		localList.value = data
	} else {
		localList.value = fold(data, measures.value)
	}
}

const getOptions = (): ColumnOptions => {
	let common = {} as Partial<Record<string, unknown>>
	const isNotGroupedAndIsMultiple = !isGrouped.value && isMultipleMeasure.value
	if (isNotGroupedAndIsMultiple) {
		common.isGroup = true
		common.seriesField = 'category'
	} else if (isGrouped.value) {
		common.isGroup = true
		common.seriesField = columnName(dimensions.value[1])
	}
	return {
		data: localList.value,
		xField: columnName(dimensions.value[0]),
		yField: isNotGroupedAndIsMultiple ? 'measure' : columnName(measures.value[0]),
		...common,
		appendPadding: [10, 10, 10, 10],
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
	}
}

const loadChart = () => {
	if (!id.value) return
	chart.value = new Column(id.value as HTMLElement, getOptions())
	chart.value.render()
}

watch(
	[dimensions, measures, list, task.settings],
	() => {
		processLocalList()
		chart.value.update(getOptions())
	},
	{ deep: true }
)

onMounted(() => {
	processLocalList()
	nextTick(() => loadChart())
})
</script>
