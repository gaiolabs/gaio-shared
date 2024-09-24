import type { ReportNodeType } from '@gaio/shared/types'
import type { LegendComponentOption } from 'echarts/types/dist/shared'

export default (task: ReportNodeType) => {
	const settings = computed(() => task.settings || {})

	const legend = () => {
		const positions = settings.value.legendPosition.split('-')
		return {
			show: settings.value.showLegend,
			type: 'scroll',
			orient: positions.includes('top') || positions.includes('bottom') ? 'horizontal' : 'vertical',
			align: 'auto',
			top:
				positions.includes('top') ? 'top'
				: positions.includes('bottom') ? 'bottom'
				: 'center',
			left:
				positions.includes('left') ? 'left'
				: positions.includes('right') ? 'right'
				: 'center',
			textStyle: {
				color: settings.value.legendFontColor,
				fontSize: Number(settings.value.legendFontSize || 13),
			},
		} as LegendComponentOption | LegendComponentOption[]
	}
	return { legend }
}
