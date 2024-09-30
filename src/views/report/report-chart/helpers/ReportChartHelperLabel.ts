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
			formatter: (v: Record<string, string | number | Date>) => {
				return formatValue(v['data'], {
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

	const labelFunnel = () => {
		return {
			show: settings.value.showLabel,
			position: 'inside',
			color: settings.value.labelFontColor,
			fontSize: settings.value.labelFontSize || 13,
			formatter: (v: object | Array<object>) => {
				const params = v as any
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
			formatter: (v: Record<string, string | number | Date>) => {
				const formatedValue = formatValue(v.value, {
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
			formatter: (v: number) => {
				const formatedValue = formatValue(v, {
					compactNumber: settings.value.compactNumberLabel,
				})
				return formatedValue.toString()
			},
		}
	}
	return { label, labelPie, labelRadar, labelFunnel, labelGauge }
}
