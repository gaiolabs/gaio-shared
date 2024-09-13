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
import { Line, type LineOptions } from '@antv/g2plot'
import type { ReportNodeType } from '@gaio/shared/types'
import { computed, nextTick } from 'vue'
import { onMounted, shallowRef } from 'vue'
import useReportChartHelper from './ReportChartHelper'

defineEmits(['change'])
const { task, list, height } = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()

const chartHelper = computed(() => useReportChartHelper(task, list))
const {
	dimensions,
	measures,
	settings,
	themeColors,
	columnName,
	label,
	processedList,
	foundation,
	isMultipleMeasure,
	isGrouped,
	firstMeasure,
	firstDimension,
	secondDimension
} = chartHelper.value

const { formatValue } = useFormatValue()
const id = shallowRef()
const chart = shallowRef()

const getOptions = (): LineOptions => {
	return {
		data: processedList('line'),
		xField: columnName(firstDimension.value),
		yField: isGrouped.value || !isMultipleMeasure.value ? columnName(firstMeasure.value) : 'measure',
		seriesField:
			isGrouped.value && !isMultipleMeasure.value ? columnName(secondDimension.value)
			: isMultipleMeasure.value ? 'category'
			: undefined,
		...foundation.value,
		lineStyle: {
			lineWidth: settings.value.lineWidth
		},
		label: label({
			formatter:
				!settings.value.compactNumberLabel ?
					null
				:	(v: Partial<Record<string, any>>) => {
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
	chart.value = new Line(id.value as HTMLElement, getOptions())
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
