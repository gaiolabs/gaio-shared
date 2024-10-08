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
import type { EChartsOption, TreemapSeriesOption } from 'echarts/types/dist/shared'
import { ref } from 'vue'
import VChart from 'vue-echarts'
import useReportChartHelper from './helpers/ReportChartHelper'
import useReportChartHelperLabel from './helpers/ReportChartHelperLabel'

const { task, list, height } = defineProps<{ task: ReportNodeType; list: Record<string, unknown>[]; height: string }>()

const { dimensions, measures, themeColors, settings, columnName } = computed(() => useReportChartHelper(task)).value
const { labelTreemap } = computed(() => useReportChartHelperLabel(task)).value

use([CanvasRenderer, GridComponent, BarChart, TitleComponent, TooltipComponent, LegendComponent])

type Datatype = {
	name: string
	path?: string
	value?: number
	children?: Datatype[]
}

const data = () => {
	const root: Datatype = { name: 'root', children: [] }

	list.forEach((item) => {
		let currentLevel = root
		let previousDimensionValue = ''
		dimensions.value.dimensions.forEach((dim, index) => {
			const dimensionValue = item[columnName(dim)] as string

			let existingDimension = currentLevel.children.find((child) => child.name === dimensionValue)

			if (previousDimensionValue === '') previousDimensionValue = dimensionValue
			else previousDimensionValue += '/' + dimensionValue
			if (!existingDimension) {
				if (dimensions.value.dimensions.length - 1 > index) {
					existingDimension = {
						name: dimensionValue,
						path: previousDimensionValue,
						children: [],
					}
				} else {
					existingDimension = {
						name: dimensionValue,
						path: previousDimensionValue,
						value: item[columnName(measures.value.first)] as number,
					}
				}
				currentLevel.children.push(existingDimension)
			}
			currentLevel = existingDimension
		})
	})
	return root
}

const grid = () => {
	const positions = settings.value.legendPosition.split('-')
	const isTopOrBottom = positions.includes('top') || positions.includes('bottom')

	const plusLegendTop = settings.value.showLegend && positions.includes('top') ? 10 : 0
	const plusLegendBottom = settings.value.showLegend && positions.includes('bottom') ? 10 : 0
	const plusLegendLeft = settings.value.showLegend && positions.includes('left') && !isTopOrBottom ? 15 : 0
	const plusLegendRight = settings.value.showLegend && positions.includes('right') && !isTopOrBottom ? 15 : 0

	const plusTitleBottom = settings.value.showXTitle ? 5 : 0
	const plusTitleLeft = settings.value.showYTitle ? 3 : 0

	return {
		top: (settings.value.appendPaddingTop ?? 0) + plusLegendTop + 3,
		bottom: (settings.value.appendPaddingBottom ?? 0) + plusLegendBottom + plusTitleBottom + 3,
		left: (settings.value.appendPaddingLeft ?? 0) + plusLegendLeft + plusTitleLeft + 3,
		right: (settings.value.appendPaddingRight ?? 0) + plusLegendRight + 3,
	}
}

const series = () => {
	return {
		type: 'treemap',
		data: data().children,
		top: grid().top + '%',
		bottom: grid().bottom + '%',
		left: grid().left + '%',
		right: grid().right + '%',
		label: labelTreemap(),
		leafDepth: settings.value.treemapLeafDepth <= 0 ? undefined : settings.value.treemapLeafDepth,
		roam: settings.value.enableTreemapZoom ? 'zoom' : 'pan',
	} as TreemapSeriesOption | TreemapSeriesOption[]
}

const option = ref<EChartsOption>({
	tooltip: {
		trigger: 'item',
	},
	color: themeColors.value,
	series: series(),
})

watch(
	[() => task, () => list, dimensions, measures, themeColors, settings.value],
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
