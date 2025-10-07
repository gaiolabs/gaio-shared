import dayjs from 'dayjs'

export const dateLiteral = [
	'YESTERDAY',
	'TODAY',
	'TOMORROW',
	'LAST_WEEK',
	'THIS_WEEK',
	'NEXT_WEEK',
	// 'LAST_MONTH',
	// 'THIS_MONTH',
	// 'NEXT_MONTH',
	// 'LAST_90_DAYS',
	// 'NEXT_90_DAYS',
	// 'THIS_QUARTER',
	// 'LAST_QUARTER',
	// 'NEXT_QUARTER',
	// 'THIS_YEAR',
	// 'LAST_YEAR',
	// 'NEXT_YEAR',
	// 'THIS_FISCAL_QUARTER',
	// 'LAST_FISCAL_QUARTER',
	// 'NEXT_FISCAL_QUARTER',
	// 'THIS_FISCAL_YEAR',
	// 'LAST_FISCAL_YEAR',
	// 'NEXT_FISCAL_YEAR',
]

export const dateNLiteral = [
	'NEXT_N_DAYS',
	'LAST_N_DAYS',
	'N_DAYS_AGO',
	'NEXT_N_WEEKS',
	'LAST_N_WEEKS',
	'N_WEEKS_AGO',
	'NEXT_N_MONTHS',
	'LAST_N_MONTHS',
	'N_MONTHS_AGO',
	'NEXT_N_QUARTERS',
	'LAST_N_QUARTERS',
	'N_QUARTERS_AGO',
	'NEXT_N_YEARS',
	'LAST_N_YEARS',
	'N_YEARS_AGO',
	'NEXT_N_FISCAL_QUARTERS',
	'LAST_N_FISCAL_QUARTERS',
	'N_FISCAL_QUARTERS_AGO',
	'NEXT_N_FISCAL_YEARS',
	'LAST_N_FISCAL_YEARS',
	'N_FISCAL_YEARS_AGO',
]

export const separateNLiteral = (value: string) => {
	const separate = `${value}`.split(':')

	return {
		dateLiteral: separate[0] || '',
		n: separate[1] || '',
	}
}

export const isDateNumberLiteral = (value: string) => {
	return dateNLiteral.includes(separateNLiteral(value).dateLiteral)
}

export const isDateLiteral = (value: string) => {
	return !!value && (dateLiteral.includes(value) || isDateNumberLiteral(value))
}

export const convertToDate = (value: string) => {
	const date = new Date()
	let result

	if (value === 'TODAY') {
		result = date
	} else if (value === 'YESTERDAY') {
		result = date.setTime(date.getTime() - 3600 * 1000 * 24).valueOf()
	} else if (value === 'TOMORROW') {
		result = date.setTime(date.getTime() + 3600 * 1000 * 24).valueOf()
	} else if (value === 'LAST_WEEK') {
		return new Date(date.getTime() - (7 + date.getDay()) * 24 * 60 * 60 * 1000)
	} else if (value === 'NEXT_WEEK') {
		const today = date.getDate()
		const dayOfTheWeek = date.getDay()
		const newDate = date.setDate(today - dayOfTheWeek + 7).valueOf()
		result = new Date(newDate)
	} else if (`${value}`.startsWith('LAST_N_DAYS')) {
		result = date.setTime(date.getTime() - 3600 * 1000 * 24 * Number(separateNLiteral(value).n) || 0).valueOf()
	} else if (`${value}`.startsWith('NEXT_N_DAYS')) {
		result = date.setTime(date.getTime() + 3600 * 1000 * 24 * Number(separateNLiteral(value).n) || 0).valueOf()
	}

	if (result) {
		return dayjs(result).format('YYYY-MM-DD')
	}
	return ''
}

export const convertDateLiteral = (value: string) => {
	if (!value) {
		return `null`
	}

	let dateLiteral = 'null'

	if (value === 'YESTERDAY') {
		dateLiteral = `subtractDays(today(), 1)`
	} else if (value === 'TODAY') {
		dateLiteral = `today()`
	} else if (value === 'TOMORROW') {
		dateLiteral = `addDays(today(), 1)`
	} else if (value === 'LAST_WEEK') {
		dateLiteral = `toStartOfWeek(subtractWeeks(today(),1))`
	} else if (value === 'THIS_WEEK') {
		dateLiteral = `subtractDays(today(), DAYOFWEEK(today()))`
	} else if (value === 'NEXT_WEEK') {
		dateLiteral = `toStartOfWeek(addWeeks(today(),1))`
	} else if (`${value}`.startsWith('LAST_N_DAYS')) {
		dateLiteral = `subtractDays(today(), ${separateNLiteral(value).n})`
	} else if (`${value}`.startsWith('NEXT_N_DAYS')) {
		dateLiteral = `addDays(today(), ${separateNLiteral(value).n})`
	}

	return dateLiteral
}
