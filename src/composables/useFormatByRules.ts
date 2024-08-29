import { isNumber, cloneDeep, isNil } from 'lodash-es'

export default () => {
	const styleReference = (col, rule) => {
		if (col.condType === 'background') {
			return {
				background: `${rule.color} !important`,
				icon: `${rule.icon}`
			}
		} else if (col.condType === 'tag') {
			return {
				tagBackground: `${rule.color ? rule.color : 'inherit'} !important`,
				icon: `${rule.icon}`
			}
		} else {
			return {
				color: `${rule.color ? rule.color : 'inherit'} !important`,
				icon: `${rule.icon}`
			}
		}
	}
	const formatStyleByRules = (row, col) => {
		if (col && col.condRules && col.condType !== 'none') {
			const value =
				!isNil(row[col.condColumnName]) ? Number(row[col.condColumnName]) : Number(row[col.alias || col.columnName])
			if (!isNaN(value)) {
				let style: Partial<{ background: string; icon: string; color: string; tagBackground: string }> = {
					tagBackground: undefined,
					background: undefined,
					icon: undefined,
					color: undefined
				}

				for (const rule of col.condRules) {
					const reference = Number(rule.reference)
					const extraReference = Number(rule.extraReference)

					if (!rule.tagName || rule.tagValue === row[rule.tagName]) {
						if (isNumber(reference)) {
							switch (rule.operator) {
								case '=':
									if (value === reference) {
										style = styleReference(col, rule)
									}
									break
								case '!=':
									if (value !== reference) {
										style = styleReference(col, rule)
									}
									break
								case '>':
									if (value > reference) {
										style = styleReference(col, rule)
									}
									break
								case '>=':
									if (value >= reference) {
										style = styleReference(col, rule)
									}
									break
								case '<':
									if (value < reference) {
										style = styleReference(col, rule)
									}
									break
								case '<=':
									if (value <= reference) {
										style = styleReference(col, rule)
									}
									break
								case 'like':
									if (`${value}`.match(new RegExp(rule.reference, 'g'))) {
										return styleReference(col, rule)
									}
									break
								case 'between':
									if (value >= reference && value <= extraReference) {
										style = styleReference(col, rule)
									}
									break
								default:
									style = {}
									break
							}
						}
					}
					if (style.background) {
						break
					}
				}
				return cloneDeep(style)
			} else {
				const stringValue = row[col.condColumnName] || row[col.alias || col.columnName]
				for (const rule of col.condRules) {
					switch (rule.operator) {
						case '=':
							if (stringValue === rule.reference) {
								return styleReference(col, rule)
							}
							break
						case '!=':
							if (stringValue !== rule.reference) {
								return styleReference(col, rule)
							}
							break
						case 'like':
							if (`${stringValue}`.match(new RegExp(rule.reference, 'g'))) {
								return styleReference(col, rule)
							}
							break
						default:
							break
					}
				}
			}
			return {}
		}
		return {}
	}

	return {
		formatStyleByRules
	}
}
