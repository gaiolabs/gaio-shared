import type { ReportNodeType } from '@gaio/shared/types'
import type { MarkAreaComponentOption } from 'echarts'

type MinMax = {
	min: number
	middle: number
	max: number
}

export default (task: ReportNodeType) => {
	const settings = computed(() => task.settings || {})

	const markArea = (xMinMax: MinMax, yMinMax: MinMax) => {
		const labels = settings.value.quadrantContent.split('\n')
		return settings.value.showQuadrant ?
				({
					silent: true,
					label: {
						show: true,
						position: 'insideTopLeft',
					},
					data: [
						[
							{
								show: settings.value.showQuadrant,
								label: {
									formatter: labels[3] ?? '',
								},
								itemStyle: { color: settings.value.regionStyle[3].fill },
								xAxis: settings.value.quadrantX ?? xMinMax.middle,
								yAxis: settings.value.quadrantY ?? yMinMax.middle,
							},
							{
								xAxis: xMinMax.min,
								yAxis: yMinMax.min,
							},
						],
						[
							{
								label: {
									formatter: labels[2] ?? '',
								},
								itemStyle: { color: settings.value.regionStyle[2].fill },
								xAxis: settings.value.quadrantX ?? xMinMax.middle,
								yAxis: settings.value.quadrantY ?? yMinMax.middle,
							},
							{
								xAxis: xMinMax.min,
								yAxis: yMinMax.max,
							},
						],
						[
							{
								label: {
									formatter: labels[1] ?? '',
								},
								itemStyle: { color: settings.value.regionStyle[1].fill },
								xAxis: settings.value.quadrantX ?? xMinMax.middle,
								yAxis: settings.value.quadrantY ?? yMinMax.middle,
							},
							{
								xAxis: xMinMax.max,
								yAxis: yMinMax.max,
							},
						],
						[
							{
								label: {
									formatter: labels[0] ?? '',
								},
								itemStyle: { color: settings.value.regionStyle[0].fill },
								xAxis: settings.value.quadrantX ?? xMinMax.middle,
								yAxis: settings.value.quadrantY ?? yMinMax.middle,
							},
							{
								xAxis: xMinMax.max,
								yAxis: yMinMax.min,
							},
						],
					],
				} as MarkAreaComponentOption)
			:	undefined
	}

	return { markArea }
}
