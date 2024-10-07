import { defaultReportTheme } from '@/composables/default-reports/defaultReportTheme'
import type { FieldType, ReportNodeType } from '@gaio/shared/types'
import { computed } from 'vue'

export default (task: ReportNodeType) => {
	const settings = computed(() => task.settings || {})

	const themeColors = computed(() => {
		return task.settings.theme?.colors || defaultReportTheme().colors
	})

	const dimensions = computed(() => {
		const dimensions = task.schema.select.filter((field) => {
			return field.type === 'value'
		})
		return {
			dimensions: dimensions,
			first: dimensions[0],
			second: dimensions[1],
			third: dimensions[2],
			isGrouped: dimensions.length > 1,
		}
	})

	const measures = computed(() => {
		const measures = task.schema.select.filter((field) => {
			return field.type !== 'value'
		})
		return {
			measures: measures,
			first: measures[0],
			second: measures[1],
			third: measures[2],
			fourth: measures[3],
			isMultiple: measures.length > 1,
		}
	})

	const columnName = (col: FieldType) => {
		if (col !== undefined)
			if (col.alias !== undefined) return col.alias as string
			else return col.columnName as string
	}

	const columnTitle = (col: FieldType) => {
		return (col.title || columnName(col)) as string
	}

	return {
		columnName,
		columnTitle,
		settings,
		dimensions,
		measures,
		themeColors,
	}
}
