<template>
	<VChart
		id="ReportChartWordcloud"
		:style="{ height }"
		:option="option"
		autoresize
	/>
</template>

<script setup lang="ts">
import type { ReportNodeType } from '@gaio/shared/types'
import { TitleComponent, TooltipComponent } from 'echarts/components'
import { GridComponent } from 'echarts/components'
import { use } from 'echarts/core'
import 'echarts-wordcloud'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption, SeriesOption } from 'echarts/types/dist/shared'
import { ref } from 'vue'
import VChart from 'vue-echarts'
import useReportChartHelper from './helpers/ReportChartHelper'

const { task, list, height } = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()

const { dimensions, measures, themeColors, settings, columnName } = computed(() => useReportChartHelper(task)).value

use([CanvasRenderer, GridComponent, TitleComponent, TooltipComponent])

const data = () => {
	const data = list.map((item) => {
		return {
			value: item[columnName(measures.value.first)] as number,
			name: item[columnName(dimensions.value.first)] as string,
		}
	})
	return data
}

const grid = () => {
	return {
		top: `${(settings.value.appendPaddingTop ?? 0) - (settings.value.appendPaddingBottom ?? 0) + 11}%`,
		left: `${(settings.value.appendPaddingLeft ?? 0) - (settings.value.appendPaddingRight ?? 0) + 13}%`,
	}
}

const series = () => {
	return {
		type: 'wordCloud',
		shape: 'diamond',
		gridSize: 18,
		top: grid().top,
		left: grid().left,
		data: data(),
	} as any as SeriesOption
}

const option = ref<EChartsOption>({
	tooltip: {
		trigger: 'item',
	},
	color: themeColors.value,
	series: series(),
})

watch(
	[() => task, () => list, dimensions, measures, themeColors],
	() => {
		option.value = {
			...option.value,
			color: themeColors.value,
			series: series(),
		}
	},
	{ deep: true },
)
</script>
