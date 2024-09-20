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
	return { label }
}
