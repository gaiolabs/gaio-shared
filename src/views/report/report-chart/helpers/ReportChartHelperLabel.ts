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
	return { label, labelPie, labelRadar }
}
