import { defaultReportTheme } from '@/composables/default-reports/defaultReportTheme'
import useFormatValue from '@/composables/useFormatValue'
import type { ColumnOptions } from '@antv/g2plot'
import type { Label } from '@antv/g2plot/lib/types/label'
import type { Legend } from '@antv/g2plot/lib/types/legend'
import type { FieldType, ReportNodeType } from '@gaio/shared/types'
import { isNil } from 'lodash-es'
import { computed } from 'vue'

export default (task: ReportNodeType) => {
	const { formatValue } = useFormatValue()

	const settings = computed(() => task.settings || {})

	const themeColors = computed(() => {
		return task.settings.theme?.colors || defaultReportTheme().colors
	})

	const dimensions = computed(() => {
		return task.schema.select.filter((field) => {
			return field.type === 'value'
		})
	})

	const measures = computed(() => {
		return task.schema.select.filter((field) => {
			return field.type !== 'value'
		})
	})

	const firstMeasure = computed(() => {
		return measures.value[0]
	})

	const firstDimension = computed(() => {
		return dimensions.value[0]
	})

	const groupedDimension = computed(() => {
		if (isGrouped.value) {
			return dimensions.value[1]
		}
		return null
	})

	const isGrouped = computed(() => {
		return dimensions.value.length > 1
	})

	const foundation = computed(() => {
		return { xAxis: xAxis(), yAxis: yAxis(), legend: legend(), meta: meta.value, animation: false }
	})

	const isMultipleMeasure = computed(() => {
		return measures.value.length > 1
	})

	const meta = computed(() => {
		const metadata: Record<string, any> = {}

		if (firstDimension.value) {
			metadata[columnName(firstDimension.value)] = {
				alias: columnTitle(firstDimension.value),
				formatter: (v: string | number | Date) => formatValue(v, firstDimension.value)
			}
		}

		if (groupedDimension.value) {
			metadata[columnName(groupedDimension.value)] = {
				alias: columnTitle(groupedDimension.value),
				formatter: (v: string | number | Date) => formatValue(v, groupedDimension.value)
			}
		}

		if (firstMeasure.value) {
			metadata[columnName(firstMeasure.value)] = {
				alias: columnTitle(firstMeasure.value),
				formatter: (v: string | number | Date) => {
					return formatValue(v, firstMeasure.value)
				}
			}

			metadata['measure'] = {
				alias: columnTitle(firstMeasure.value),
				formatter: (v: string | number | Date) => formatValue(v, firstMeasure.value)
			}
		}

		return metadata
	})

	const columnName = (col: FieldType) => {
		return (col.alias || col.columnName) as string
	}

	const columnTitle = (col: FieldType) => {
		return (col.title || columnName(col)) as string
	}

	const tickCount = (type: string) => {
		let countTicks = 0
		switch (type) {
			case 'xAxis':
				countTicks = settings.value.xAxisTickCount
				break
			case 'yAxis':
				countTicks = settings.value.yAxisTickCount
				break
		}

		return countTicks >= 2 ? countTicks : undefined
	}

	const label = (more = {}) => {
		return settings.value.showLabel ?
				({
					autoRotate: true,
					autoHide: false,
					autoEllipsis: true,
					rotate: settings.value.labelRotate ? 200 : undefined,
					position: labelPosition(),
					style: {
						lineWidth: 0.8,
						stroke: 'white',
						fontSize: Number(settings.value.labelFontSize || 12),
						fill: settings.value.labelFontColor
					},
					layout: [{ type: 'interval-hide-overlap' }],
					...more
				} as Label)
			:	undefined
	}

	const linearLabel = (total: number) => {
		return label({
			formatter: (v: Record<string, any>) => {
				const measure: number = v['measure'] || v[columnName(firstMeasure.value)]
				let value = formatValue(measure, {
					...firstMeasure.value,
					compactNumber: settings.value.compactNumberLabel
				})

				const breakLine = settings.value.columnBar ? '\n' : ' '
				if (settings.value.showLabelPercent) {
					const percent = (measure || 0) / total
					value = `${value} ${breakLine} ${formatValue(percent, {
						formatType: 'percentage',
						formatDecimalSize: 1,
						separators: firstMeasure.value.separators || 'noneComma'
					})}`
				}
				return [value]
			}
		})
	}

	const labelPosition = () => {
		if (task.reportType === 'pie') {
			switch (settings.value.showLabelType) {
				case 'top':
					return 'outer'
				case 'bottom':
					return 'spider'
				default:
					return 'inner'
			}
		} else if (settings.value.type === 'stacked' || settings.value.type === 'column') {
			if (settings.value.columnBar) {
				return settings.value.showLabelType
			} else {
				switch (settings.value.showLabelType) {
					case 'top':
						return 'right'
					case 'middle':
						return 'middle'
					case 'bottom':
						return 'left'
					default:
						return 'right'
				}
			}
		}
		return settings.value.showLabelType
	}

	const xAxis = (more = {}) => {
		const rangeOptions: Record<string, number[]> = {}

		if (['line', 'area'].includes(task.reportType)) {
			rangeOptions['range'] = [0, 1]
		}

		return (
			settings.value.showXAxis ?
				{
					max: settings.value.xAxisChangeScale ? Number(settings.value.xAxisMaxScale) : undefined,
					min: settings.value.xAxisChangeScale ? Number(settings.value.xAxisMinScale) : undefined,
					tickCount: tickCount('xAxis'),
					...rangeOptions,
					title: settings.value.showXTitle ? {} : null,
					label: {
						autoEllipsis: true,
						autoRotate: settings.value.xAxisAutoRotateLabel,
						autoHide: settings.value.xAxisAutoHideLabel,
						style: {
							lineWidth: 0,
							fontSize: Number(settings.value.axisFontSize || 11),
							fill: settings.value.axisFontColor,
							whiteSpace: 'pre-wrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis'
						},
						formatter:
							settings.value.compactNumberAxis && !settings.value.columnBar && settings.value.type === 'column' ?
								(v: string | number | Date, t: Record<string, any>) => {
									let base = v
									if (t['id']) {
										base = t['id']
									}
									return formatValue(base, {
										compactNumber: settings.value.compactNumberAxis
									})
								}
							:	null
					},
					grid:
						settings.value.showXGrid ?
							{
								line: {
									style: {
										stroke: '#eee',
										lineDash: [1],
										lineWidth: 1,
										cursor: 'pointer'
									}
								}
							}
						:	null,
					line:
						settings.value.showXLine ?
							{
								style: {
									stroke: '#ccc',
									lineWidth: 1
								}
							}
						:	null,
					text:
						settings.value.showXTitle ?
							{
								style: {
									lineWidth: 0,
									fontSize: Number(settings.value.axisFontSize || 11),
									fill: settings.value.axisFontColor
								}
							}
						:	null,
					...more
				}
			: ['line', 'area'].includes(task.reportType) ?
				{
					...rangeOptions,
					label: null,
					grid: null,
					line: null,
					text: null
				}
			:	undefined
		)
	}

	const yAxis = (more = {}) => {
		return settings.value.showYAxis ?
				{
					max: settings.value.yAxisChangeScale ? Number(settings.value.yAxisMaxScale) : undefined,
					min: settings.value.yAxisChangeScale ? Number(settings.value.yAxisMinScale) : undefined,
					tickCount: tickCount('yAxis'),
					tickMethod: settings.value.tickMethod,
					title: settings.value.showYTitle ? {} : null,
					label: {
						autoRotate: settings.value.yAxisAutoRotateLabel,
						autoHide: settings.value.yAxisAutoHideLabel,
						autoEllipsis: true,
						style: {
							lineWidth: 0,
							fontSize: Number(settings.value.axisFontSize || 11),
							fill: settings.value.axisFontColor,
							whiteSpace: 'pre-wrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis'
						},
						formatter:
							(
								(settings.value.compactNumberAxis && settings.value.columnBar && settings.value.type === 'column') ||
								(settings.value.compactNumberAxis && settings.value.type !== 'column')
							) ?
								(v, t) => {
									let base = v
									if (t['id']) {
										base = t['id']
									}
									return formatValue(base, {
										compactNumber: settings.value.compactNumberAxis
									})
								}
							:	null
					},
					grid:
						settings.value.showYGrid ?
							{
								line: {
									style: {
										stroke: '#ddd',
										lineDash: [1],
										lineWidth: 1,
										cursor: 'pointer'
									}
								}
							}
						:	null,
					line:
						settings.value.showYLine ?
							{
								style: {
									stroke: '#ccc',
									lineWidth: 1
								}
							}
						:	null,
					text:
						settings.value.showYTitle ?
							{
								style: {
									lineWidth: 0,
									fontSize: Number(settings.value.axisFontSize || 11),
									fill: settings.value.axisFontColor
								}
							}
						:	null,
					...more
				}
			:	undefined
	}

	const legend = (more: Legend = {}) => {
		return settings.value.showLegend ?
				({
					enabled: true,
					position: `${settings.value.legendPosition}`.replace('-center', ''),
					itemName: {
						style: {
							lineWidth: 0,
							fontSize: Number(settings.value.legendFontSize || 11),
							fill: settings.value.legendFontColor
						}
					},
					...more
				} as Legend)
			:	false
	}

	const guideLine = computed(() => {
		if (settings.value.guidelineType && settings.value.guidelineType !== 'none') {
			return [
				{
					type: 'line',
					start: ['min', settings.value.guidelineType],
					end: ['max', settings.value.guidelineType],
					text: {
						position: settings.value.guidelineTextPosition || 'start',
						content: settings.value.guidelineText
					},
					autoAdjust: true,
					color: '#222',
					style: {
						color: '#222',
						fill: 'black'
					}
				}
			]
		} else {
			return []
		}
	})

	const appendPadding = () => {
		if (
			isNil(settings.value.appendPaddingTop) &&
			isNil(settings.value.appendPaddingRight) &&
			isNil(settings.value.appendPaddingBottom) &&
			isNil(settings.value.appendPaddingLeft)
		) {
			return 30
		}

		return [
			Number(settings.value.appendPaddingTop || 0),
			Number(settings.value.appendPaddingRight || 0),
			Number(settings.value.appendPaddingBottom || 0),
			Number(settings.value.appendPaddingLeft || 0)
		]
	}

	const getColumnReference = (seriesName: string) => {
		return task.schema.select.find((col) => columnName(col) === seriesName) || {}
	}

	const tooltip = () => {
		return {
			// show: true,
			// axisPointer: {
			//     type: 'shadow'
			// }
			// valueFormatter: function (params) {
			//     return 2
			// }
			// formatter: function (params) {
			//     console.log(params)
			//     return 'a'
			//     // return 'X: ' + params.data[0].toFixed(2) + '<br>Y: ' + params.data[1].toFixed(2)
			// }
		}
	}

	const valueFormatter = (value: string | number | Date, col: ColumnOptions) => formatValue(value, col)
	const legendName = (name: string) => columnTitle(getColumnReference(name))

	const seriesLabel = () => {
		return {
			show: !!settings.value.showLabel,
			position: 'top',
			formatter: function (params) {
				return formatValue(params.value[params.seriesName], getColumnReference(params.seriesName))
			}
		}
	}

	return {
		foundation,
		seriesLabel,
		tooltip,
		valueFormatter,
		legendName,
		columnName,
		columnTitle,
		appendPadding,
		yAxis,
		xAxis,
		legend,
		label,
		linearLabel,
		isMultipleMeasure,
		isGrouped,
		guideLine,
		meta,
		firstMeasure,
		firstDimension,
		settings,
		dimensions,
		measures,
		themeColors
	}
}
