import { useAuthStore } from '@/stores'
import type { FieldType } from '@gaio/shared/types'
import dayjs from 'dayjs'
import { cloneDeep, isNil } from 'lodash-es'

type ColumnOptions = {
	compactNumber?: boolean
	formatType?: string
	separators?: string
	formatDecimalSize?: number
	formatPrefix?: string
	columnLength?: number
	dataType?: string
	columnName?: string
	alias?: string
	formatDate?: string
	formatSuffix?: string
} & FieldType

export default () => {
	const auth = useAuthStore()
	const locale = auth.user.lang
	const localeLanguageName = locale && locale.toLowerCase().includes('pt') ? 'pt-BR' : 'en-US'
	const userSeparators = locale && locale.toLowerCase().includes('pt') ? 'dotComma' : 'commaDot'

	const canBeANumber = (n: string | number | unknown) => {
		const number = `${n}`.replace(/em/g, '').trim()

		if (typeof n === 'string') {
			if (n.trim().startsWith('0') && !n.trim().startsWith('0.')) {
				return false
			}
		}

		return /^-?[\d.]+(?:e-?\d+)?$/.test(number)
	}

	const numberFormat = (number: number, decimals: number, decPoint: string, thousandsSep: string) => {
		const n = !isFinite(+number) ? 0 : +number
		const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
		const sep = typeof thousandsSep === 'undefined' ? ',' : thousandsSep
		const dec = typeof decPoint === 'undefined' ? '.' : decPoint
		const toFixedFix = function (n: number, prec: number) {
			// Fix for IE parseFloat(0.55).toFixed(0) = 0;
			const k = Math.pow(10, prec)
			return Math.round(n * k) / k
		}
		const s = (prec ? toFixedFix(n, prec) : Math.round(n)).toString().split('.')
		if (s[0].length > 3) {
			s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
		}
		if ((s[1] || '').length < prec) {
			s[1] = s[1] || ''
			s[1] += new Array(prec - s[1].length + 1).join('0')
		}
		return s.join(dec)
	}

	const getThousandSeparator = (col: ColumnOptions) => {
		if (col.separators) {
			switch (col.separators) {
				case 'dotComma':
					return '.'
				case 'commaDot':
					return ','
				case 'noneComma':
					return ''
				case 'noneDot':
					return ''
			}
		}
		return ''
	}

	const getDecimalSeparator = (col: ColumnOptions) => {
		if (col.separators) {
			switch (col.separators) {
				case 'dotComma':
					return ','
				case 'commaDot':
					return '.'
				case 'noneComma':
					return ','
				case 'noneDot':
					return '.'
			}
		}
		return '.'
	}

	const isFloat = (col: FieldType) => {
		return col.dataType && (col.dataType.includes('Float') || col.dataType.includes('Decimal'))
	}

	const defaultFormatNumeric = (value: number) => {
		return formatValue(value, {
			formatType: 'decimal',
			formatDecimalSize: 0,
			separators: userSeparators
		})
	}

	const defaultFormatDecimal = (value: number, dec = 2) => {
		return formatValue(value, {
			formatType: 'decimal',
			formatDecimalSize: dec || 2,
			separators: userSeparators
		})
	}

	const formatValue = (rowValue: string | number | Date, columnOptions?: ColumnOptions) => {
		if (columnOptions.separators) {
			columnOptions.separators = auth.defaultNumberFormat
		}

		let value = cloneDeep(rowValue)
		let col = cloneDeep(columnOptions) as ColumnOptions

		if (isNil(value)) {
			return null
		}

		if (col?.dataType?.includes('Array')) {
			return value
		}

		if (!col.compactNumber) {
			try {
				if (!col.formatType || col.formatType === 'none') {
					if (isFloat(col)) {
						col = {
							...col,
							formatType: 'decimal',
							separators: 'noneDot',
							formatDecimalSize: Number(col.columnLength) || 2
						}
					} else if (col.dataType && col.dataType.includes('DateTime')) {
						col = {
							...col,
							formatType: 'date',
							formatDate: 'YYYY-MM-DD H:mm:ss'
						}
					} else if (col.dataType && col.dataType.includes('Date')) {
						col = {
							...col,
							formatType: 'date',
							formatDate: 'YYYY-MM-DD'
						}
					}
				}

				switch (col.formatType) {
					case 'decimal':
						if (Number(value) || Number(value) === 0) {
							value = numberFormat(
								Number(value),
								col.formatDecimalSize || 0,
								getDecimalSeparator(col),
								getThousandSeparator(col)
							)
						}
						break
					case 'percentage':
						if (Number(value) || Number(value) === 0) {
							value = `${numberFormat(
								Number(value) * 100,
								col.formatDecimalSize || 0,
								getDecimalSeparator(col),
								getThousandSeparator(col)
							)}%`
						}
						break
					case 'date': {
						if (value) {
							return dayjs(value).format(col.formatDate || 'DD/MMM/YYYY')
						}
						return null
					}
					case 'yearMonth':
						if (canBeANumber(value) && `${value}`.length === 6) {
							if (typeof value === 'string') {
								return yearMonthToNames(Number(value.substring(0, 4)), Number(value.substring(4, 6)), locale)
							}
						}
						return null
				}
			} catch (e) {
				console.log('error when format value', e['message'])
			}
		} else {
			if (typeof value === 'number') {
				value =
					Number(value) ?
						Intl.NumberFormat(localeLanguageName, {
							notation: 'compact',
							maximumFractionDigits: 2
						}).format(value)
					:	value
			}
		}

		if (value && col.formatPrefix) {
			value = `${col.formatPrefix || ''} ${value}`
		}

		if ((value && col.formatPrefix) || col.formatSuffix) {
			value = `${value} ${col.formatSuffix || ''}`
		}

		return value
	}

	const yearMonthToNames = (year: number, month: number, locale: string) => {
		const monthNames = {
			'en-US': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			'pt-BR': ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
		}

		return `${monthNames[locale || 'pt-BR'][month - 1]}/${year}`
	}

	return {
		defaultUserSeparator: userSeparators,
		formatValue,
		defaultFormatNumeric,
		defaultFormatDecimal
	}
}
