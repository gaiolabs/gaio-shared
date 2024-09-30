import type { ReportNodeType } from '@gaio/shared/types'
import type { GridOption } from 'echarts/types/dist/shared'

export default (task: ReportNodeType) => {
	const settings = computed(() => task.settings || {})

	const grid = () => {
		const positions = settings.value.legendPosition.split('-')
		const isTopOrBottom = positions.includes('top') || positions.includes('bottom')

		const plusLegendTop = settings.value.showLegend && positions.includes('top') ? 10 : 0
		const plusLegendBottom = settings.value.showLegend && positions.includes('bottom') ? 10 : 0
		const plusLegendLeft = settings.value.showLegend && positions.includes('left') && !isTopOrBottom ? 15 : 0
		const plusLegendRight = settings.value.showLegend && positions.includes('right') && !isTopOrBottom ? 15 : 0

		const plusTitleBottom = settings.value.showXTitle ? 5 : 0
		// const plusTitleLeft = 0
		const plusTitleLeft = settings.value.showYTitle ? 3 : 0

		return {
			top: `${(settings.value.appendPaddingTop ?? 0) + plusLegendTop + 3}%`,
			bottom: `${(settings.value.appendPaddingBottom ?? 0) + plusLegendBottom + plusTitleBottom + 3}%`,
			left: `${(settings.value.appendPaddingLeft ?? 0) + plusLegendLeft + plusTitleLeft + 3}%`,
			right: `${(settings.value.appendPaddingRight ?? 0) + plusLegendRight + 3}%`,
			containLabel: true,
		}
		// } as GridOption | GridOption[]
	}

	const gridWithoutAxis = () => {
		const positions = settings.value.legendPosition.split('-')
		const isTopOrBottom = positions.includes('top') || positions.includes('bottom')

		const plusLegendTop = settings.value.showLegend && positions.includes('top') ? 10 : 0
		const plusLegendBottom = settings.value.showLegend && positions.includes('bottom') ? 10 : 0
		const plusLegendLeft = settings.value.showLegend && positions.includes('left') && !isTopOrBottom ? 15 : 0
		const plusLegendRight = settings.value.showLegend && positions.includes('right') && !isTopOrBottom ? 15 : 0

		return {
			top: `${(settings.value.appendPaddingTop ?? 0) + plusLegendTop + 3}%`,
			bottom: `${(settings.value.appendPaddingBottom ?? 0) + plusLegendBottom + 3}%`,
			left: `${(settings.value.appendPaddingLeft ?? 0) + plusLegendLeft + 3}%`,
			right: `${(settings.value.appendPaddingRight ?? 0) + plusLegendRight + 3}%`,
			containLabel: true,
		}
	}
	return { grid, gridWithoutAxis }
}
