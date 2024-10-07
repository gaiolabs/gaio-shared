import useFormatValue from '@/composables/useFormatValue'
import type { FieldType, ReportNodeType } from '@gaio/shared/types'

export default (task: ReportNodeType) => {
	const { formatValue } = useFormatValue()
	const settings = computed(() => task.settings || {})

	const label = (measures: FieldType[]) => {
		return {
			show: settings.value.showLabel,
			position: settings.value.showLabelType,
			color: settings.value.labelFontColor,
			fontSize: settings.value.labelFontSize || 13,
			rotate: settings.value.labelRotate ? 90 : undefined,
			formatter: (params: Record<string, string | number | Date>) => {
				return formatValue(params['data'], {
					...measures,
					compactNumber: settings.value.compactNumberLabel,
				})
			},
		}
	}

	const labelPie = () => {
		return {
			show: settings.value.showLabel,
			position: settings.value.showLabelType.includes('top') ? 'outside' : settings.value.showLabelType,
			color: settings.value.labelFontColor,
			fontSize: settings.value.labelFontSize || 13,
			formatter: (v: object | Array<object>) => {
				const params = v as any
				let labelString = formatValue(params.data.value, {
					compactNumber: settings.value.compactNumberLabel,
				})
				if (settings.value.showLabelDimension) {
					labelString = `${params.data.name}\n${labelString} `
				}
				if (settings.value.showLabelPercent) {
					labelString += `\n${params.percent.toFixed(2)}% `
				}
				return labelString
			},
		}
	}

	const labelHeatmap = () => {
		return {
			show: settings.value.showLabel,
			position: settings.value.showLabelType.includes('top') ? 'outside' : settings.value.showLabelType,
			color: settings.value.labelFontColor,
			fontSize: settings.value.labelFontSize || 13,
			formatter: (params: Record<string, any>) => {
				const labelString = formatValue(params.data[2], {
					compactNumber: settings.value.compactNumberLabel,
				})
				return labelString
			},
		}
	}

	const labelFunnel = () => {
		return {
			show: settings.value.showLabel,
			position: 'inside',
			color: settings.value.labelFontColor,
			fontSize: settings.value.labelFontSize || 13,
			formatter: (params: Record<string, any>) => {
				let labelString = ''
				if (settings.value.showLabelMeasure) {
					labelString = formatValue(params.data.value, {
						compactNumber: settings.value.compactNumberLabel,
					}).toString()
				}
				if (settings.value.showLabelDimension) {
					labelString = `${params.data.name}\n${labelString} `
				}
				if (settings.value.showLabelPercent) {
					labelString += `\n${params.percent.toFixed(2)}% `
				}
				return labelString
			},
		}
	}

	const labelRadar = () => {
		return {
			show: settings.value.showLabel,
			alignTicks: false,
			position: settings.value.showLabelType.includes('top') ? 'outside' : settings.value.showLabelType,
			color: settings.value.labelFontColor,
			fontSize: settings.value.labelFontSize || 13,
			formatter: (params: Record<string, string | number | Date>) => {
				const formatedValue = formatValue(params.value, {
					compactNumber: settings.value.compactNumberLabel,
				})
				return formatedValue
			},
		}
	}

	const labelGauge = () => {
		return {
			show: settings.value.showLabel,
			alignTicks: false,
			color: settings.value.labelFontColor ?? '#000000FF',
			distance: 40,
			fontSize: settings.value.labelFontSize || 13,
			formatter: (params: number) => {
				const formatedValue = formatValue(params, {
					compactNumber: settings.value.compactNumberLabel,
				})
				return formatedValue.toString()
			},
		}
	}

	const labelSunburst = () => {
		return {
			show: settings.value.showLabel,
			align: 'center',
			position: settings.value.showLabelType.includes('top') ? 'outside' : settings.value.showLabelType,
			color: settings.value.labelFontColor ?? '#000000FF',
			distance: 40,
			fontSize: settings.value.labelFontSize || 13,
		}
	}

	const labelTreemap = () => {
		const label = {
			show: settings.value.showLabel,
			position: settings.value.showLabelType.includes('top') ? 'outside' : settings.value.showLabelType,
			color: settings.value.labelFontColor,
			fontSize: settings.value.labelFontSize || 13,
			formatter: (params: Record<string, any>) => {
				let labelString = ''
				if (settings.value.showLabelMeasure) {
					labelString = formatValue(params.data.value, {
						compactNumber: settings.value.compactNumberLabel,
					}).toString()
				}
				if (settings.value.showLabelDimension) {
					labelString = `${params.data.name}\n${labelString}`
				}
				if (settings.value.showPathTreemap) {
					let path = ''
					params.data.path.split('/').forEach((item: string) => (path += item + '\n'))
					labelString = `${path}\n${labelString}`
				}
				return labelString
			},
		}
		return label
	}
	return { label, labelPie, labelRadar, labelFunnel, labelGauge, labelSunburst, labelTreemap, labelHeatmap }
}
