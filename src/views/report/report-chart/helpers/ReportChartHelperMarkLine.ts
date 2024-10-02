import type { ReportNodeType } from '@gaio/shared/types'
import type { MarkLineComponentOption } from 'echarts'

type MinMax = {
	min: number
	middle: number
	max: number
}

export default (task: ReportNodeType) => {
	const settings = computed(() => task.settings || {})

	const markLine = (xMinMax: MinMax, yMinMax: MinMax) => {
		return settings.value.showQuadrant ?
				({
					animation: false,
					silent: true,
					symbol: '',
					data: [
						{
							xAxis: settings.value.quadrantX ?? xMinMax.middle,
							label: {
								show: false,
							},
						},
						{
							yAxis: settings.value.quadrantY ?? yMinMax.middle,
							label: {
								show: false,
							},
						},
					],
				} as MarkLineComponentOption)
			:	undefined
	}

	return { markLine }
}
