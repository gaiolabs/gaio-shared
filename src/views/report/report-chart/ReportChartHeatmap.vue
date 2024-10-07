<template>
	<VChart
		:style="{ height }"
		:option="option"
		autoresize
	/>
</template>

<script setup lang="ts">
import type { ReportNodeType } from '@gaio/shared/types'
import { HeatmapChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { GridComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import type {
	CalendarOption,
	EChartsOption,
	HeatmapSeriesOption,
	VisualMapComponentOption,
} from 'echarts/types/dist/shared'
import { ref } from 'vue'__
import VChart from 'vue-echarts'
import useReportChartHelper from './helpers/ReportChartHelper'
import useReportChartHelperTicks from './helpers/ReportChartHelperTicks'

const { task, list, height } = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()

const { dimensions, measures, themeColors, settings, columnName } = computed(() => useReportChartHelper(task)).value
const { getMinMaxValues } = computed(() => useReportChartHelperTicks()).value

use([CanvasRenderer, GridComponent, HeatmapChart, TitleComponent, TooltipComponent, LegendComponent])

const data = () => {
	const data = list.map((item) => {
		return [item[columnName(dimensions.value.first)] as string, item[columnName(measures.value.first)] as number]
	})
	return data
}

const range = () => {
	const sortedData = data().sort(
		(a: (string | number)[], b: (string | number)[]) => new Date(a[0]).getTime() - new Date(b[0]).getTime(),
	)

	let oldest: string = sortedData[0][0].toString()
	let newest: string = sortedData[sortedData.length - 1][0].toString()
	let range: string | string[] = []

	if (settings.value.showFullYear) {
		oldest = oldest.split('-')[0]
		newest = newest.split('-')[0]
	}
	if (oldest === newest) range = newest
	else range = [oldest, newest]

	return range
}

const grid = () => {
	const positions = settings.value.legendPosition.split('-')
	const isTopOrBottom = positions.includes('top') || positions.includes('bottom')
	const plusLegendBottom = settings.value.showLegend && positions.includes('bottom') ? 10 : 0
	const plusLabelTop = settings.value.showLabel ? 10 : 0
	const plusLabelLeft = settings.value.showLabel && positions.includes('left') && !isTopOrBottom ? 15 : 0
	return {
		top: `${(settings.value.appendPaddingTop ?? 0) + plusLabelTop + 3}`,
		bottom: `${(settings.value.appendPaddingBottom ?? 0) + plusLegendBottom + 3}`,
		left: `${(settings.value.appendPaddingLeft ?? 0) + plusLabelLeft + 5}`,
		right: `${(settings.value.appendPaddingRight ?? 0) + 3}`,
	}
}

const allMeasures = list.map((item) => {
	return item[columnName(measures.value.first)]
}) as number[]

const minMax = getMinMaxValues(allMeasures)

const visualMap = () => {
	const visualMap: VisualMapComponentOption = {
		show: settings.value.showLegend,
		min: minMax.min,
		max: minMax.max,
		type: 'piecewise',
		orient: 'horizontal',
		calculable: true,
		left: `${27 + Number(grid().left) - Number(grid().right)}%`,
		top: `${105 - Number(grid().bottom)}%`,
		align: 'auto',
		inRange: {
			color: [themeColors.value[0], themeColors.value[1]],
		},
	}
	return visualMap
}

const calendar = () => {
	const calendar: CalendarOption = {
		top: grid().top + '%',
		bottom: grid().bottom + '%',
		left: grid().left + '%',
		right: grid().right + '%',
		cellSize: ['auto'],
		itemStyle: {
			borderWidth: 0.5,
		},
		yearLabel: { show: false },
		monthLabel: { show: settings.value.showLabel, fontSize: settings.value.labelFontSize },
		dayLabel: { show: settings.value.showLabel, fontSize: settings.value.labelFontSize },
		range: range(),
	}
	return calendar
}

const series = () => {
	const serie: HeatmapSeriesOption = {
		type: 'heatmap',
		coordinateSystem: 'calendar',
		data: data(),
	}
	return serie
}

const option = ref<EChartsOption>({
	tooltip: {
		formatter: (params: Record<string, any>) => {
			const date = params['value'][0]
			const value = params['value'][1]

			const dateObj = new Date(date)
			const day = String(dateObj.getDate()).padStart(2, '0')
			const month = String(dateObj.getMonth() + 1).padStart(2, '0')
			const year = dateObj.getFullYear()

			return day + '/' + month + '/' + year + `<br/>${value}`
		},
	},
	visualMap: visualMap(),
	calendar: calendar(),
	series: series(),
})

watch(
	[() => task, () => list, dimensions, settings, measures, themeColors],
	() => {
		option.value = {
			...option.value,
			visualMap: visualMap(),
			calendar: calendar(),
			series: series(),
		}
	},
	{ deep: true },
)
</script>
