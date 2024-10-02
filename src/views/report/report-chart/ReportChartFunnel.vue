<template>
	<VChart
		:style="{ height }"
		:option="option"
		autoresize
	/>
</template>

<script setup lang="ts">
import type { ReportNodeType } from '@gaio/shared/types'
import { BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { GridComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption, FunnelSeriesOption } from 'echarts/types/dist/shared'
import { ref } from 'vue'
import VChart from 'vue-echarts'
import useReportChartHelper from './helpers/ReportChartHelper'
import useReportChartHelperGrid from './helpers/ReportChartHelperGrid'
import useReportChartHelperLabel from './helpers/ReportChartHelperLabel'
import useReportChartHelperLegend from './helpers/ReportChartHelperLegend'
import useReportChartHelperTicks from './helpers/ReportChartHelperTicks'

const { task, list, height } = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()

const { dimensions, measures, themeColors, settings, columnName } = computed(() => useReportChartHelper(task)).value
const { legend } = computed(() => useReportChartHelperLegend(task)).value
const { gridWithoutAxis } = computed(() => useReportChartHelperGrid(task)).value
const { labelFunnel } = computed(() => useReportChartHelperLabel(task)).value
const { getMinMaxValues } = computed(() => useReportChartHelperTicks()).value

use([CanvasRenderer, GridComponent, BarChart, TitleComponent, TooltipComponent, LegendComponent])

const series = () => {
	const values = list.map((item) => {
		return {
			value: item[columnName(measures.value.first)],
			name: item[columnName(dimensions.value.first)],
		}
	})

	const allMeasures = list.map((item) => {
		return item[columnName(measures.value.first)]
	}) as number[]

	const minMax = getMinMaxValues(allMeasures)

	const gridForChart = gridWithoutAxis()
	return {
		name: columnName(measures.value.first),
		type: 'funnel',
		data: values,
		top: gridForChart.top,
		bottom: gridForChart.bottom,
		left: gridForChart.left,
		right: gridForChart.right,
		label: labelFunnel(),
		orient: settings.value.transposed ? 'horizontal' : 'vertical',
		min: minMax.min,
		max: minMax.max,
		sort: 'descending',
		gap: 0,
		labelLine: {
			length: 10,
			lineStyle: {
				width: 1,
				type: 'solid',
			},
		},
		itemStyle: {
			borderColor: '#fff',
			borderWidth: 1,
		},
		emphasis: {
			label: {
				fontSize: 20,
			},
		},
		// ...grid(),
	} as FunnelSeriesOption | FunnelSeriesOption[]
}

const option = ref<EChartsOption>({
	tooltip: {
		trigger: 'item',
	},
	color: themeColors.value,
	series: series(),
	legend: legend(),
})

watch(
	[() => task, () => list, dimensions, measures, themeColors],
	() => {
		option.value = {
			...option.value,
			color: themeColors.value,
			series: series(),
			legend: legend(),
		}
	},
	{ deep: true },
)
</script>

<!-- <template>
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
import useReportChartHelper from './ReportChartHelperGplot'

defineEmits(['change'])
const { task, list, height } = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()

const chartHelper = computed(() => useReportChartHelper(task, list))
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
</script> -->
