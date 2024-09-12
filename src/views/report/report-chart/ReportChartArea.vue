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
import useFormatValue from '@/composables/useFormatValue'
import { fold } from '@/views/report/report-chart/fold'
import { Area, type AreaOptions } from '@antv/g2plot'
import type { ReportNodeType } from '@gaio/shared/types'
import { computed, nextTick } from 'vue'
import { onMounted, shallowRef } from 'vue'
import useReportChartHelper from './ReportChartHelper'

defineEmits(['change'])
const { task, list, height } = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()

const chartHelper = computed(() => useReportChartHelper(task))
const {
	dimensions,
	measures,
	settings,
	columnName,
	themeColors,
	label,
	firstMeasure,
	foundation,
	isGrouped,
	isMultipleMeasure
} = chartHelper.value

const { formatValue } = useFormatValue()
const id = shallowRef()
const chart = shallowRef()
const localList = shallowRef([])

const processLocalList = () => {
	let data = list

	if (isGrouped.value || !isMultipleMeasure.value) {
		localList.value = data
	} else {
		localList.value = fold(data, measures.value)
	}
}

const getOptions = (): AreaOptions => {
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
		...foundation.value,
		line: {
			size: settings.value.lineWidth || 1
		},
		label: label({
			formatter:
				!settings.value.compactNumberLabel ?
					null
				:	(v: { [x: string]: never }) => {
						const value = v['measure'] || v[columnName(firstMeasure.value)]
						return formatValue(value, {
							compactNumber: settings.value.compactNumberLabel
						})
					}
		}),
		smooth: settings.value.lineSmooth,
		point:
			settings.value.showPoint ?
				{
					shape: settings.value.pointType
				}
			:	null,
		color:
			isGrouped.value || isMultipleMeasure.value ? themeColors.value
			: settings.value.showLegend ? themeColors.value
			: themeColors.value[0]
	}
}

const loadChart = () => {
	if (!id.value) return
	chart.value = new Area(id.value as HTMLElement, getOptions())
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
