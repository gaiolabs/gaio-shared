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
import { Line, type LineOptions } from '@antv/g2plot'
import type { ReportNodeType } from '@gaio/shared/types'
import { computed, nextTick } from 'vue'
import { onMounted, shallowRef } from 'vue'
import useReportChartHelper from './ReportChartHelper'

defineEmits(['change'])
const props = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()

const chartHelper = computed(() => useReportChartHelper(props.task))
const { dimensions, measures, settings, columnName, themeColors, appendPadding, label, firstMeasure, foundation } =
	chartHelper.value

const { formatValue } = useFormatValue()
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
		common.xField = columnName(dimensions.value[0])
		common.yField = 'measure'
		common.seriesField = 'category'
	} else if (isGrouped.value) {
		common.xField = columnName(dimensions.value[0])
		common.yField = columnName(measures.value[0])
		common.seriesField = columnName(dimensions.value[1])
	} else {
		common.xField = columnName(dimensions.value[0])
		common.yField = columnName(measures.value[0])
	}

	common.padding = appendPadding()

	chart.value = new Line(
		id.value as HTMLElement,
		{
			data: localList.value,
			...common,
			...foundation.value,
			lineStyle: {
				lineWidth: settings.value.lineWidth
			},
			label: label({
				formatter:
					!settings.value.compactNumberLabel ?
						null
					:	(v) => {
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
		} as LineOptions
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

	nextTick(() => {
		loadChart()
	})
})
</script>
