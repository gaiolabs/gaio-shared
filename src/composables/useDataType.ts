export default () => {
	const dataTypeLabel = (name: string) => {
		switch (name) {
			case 'Nullable(String)':
				return 'string'
			case 'Nullable(Int64)':
				return 'integer'
			case 'Nullable(Float64)':
				return 'decimal'
			case 'Nullable(Date)':
				return 'date'
			case 'Nullable(DateTime)':
				return 'datetime'
			default:
				return name
		}
	}

	const dataTypeList = [
		'Nullable(String)',
		'Nullable(Int64)',
		'Nullable(Float64)',
		'Nullable(Date)',
		'Nullable(DateTime)',
		'Array',
		'JSON'
	]

	const dataTypeClickhouseNames = (dataType: string) => {
		if (['Nullable(String)', 'String'].includes(dataType)) {
			return 'string'
		} else if (['Nullable(Int64)', 'Int64'].includes(dataType)) {
			return 'integer'
		} else if (['Nullable(Float64)', 'Float64'].includes(dataType)) {
			return 'float'
		} else if (['Nullable(Date)', 'Date'].includes(dataType)) {
			return 'date'
		} else if (['Nullable(DateTime)', 'DateTime'].includes(dataType)) {
			return 'datetime'
		} else if (dataType.toLowerCase().includes('array')) {
			return 'array'
		} else {
			return 'string'
		}
	}

	const isDateTime = (text: string) => {
		const dates = ['Nullable(DateT', 'Nullable(Datetime', 'DateT', 'Datetim']
		let status = false
		for (const d of dates) {
			if (text.includes(d)) {
				status = true
			}
		}
		return status
	}

	const isDate = (text: string) => {
		const dates = ['Nullable(Date', 'Nullable(Time', 'Date']
		let status = false
		for (const d of dates) {
			if (text && text.includes(d)) {
				status = true
			}
		}
		return status
	}

	const isTextField = (dataType: string) => {
		return !isNumberField(dataType) && !isDateTime(dataType) && !isDate(dataType)
	}

	const isDecimal = (text: string) => {
		const numbers = ['Nullable(Float', 'Nullable(Decimal', 'Decimal', 'Float']

		let status = false
		for (const n of numbers) {
			if (text && text.includes(n)) {
				status = true
			}
		}
		return status
	}

	const isNumberField = (text: string) => {
		const numbers = [
			'Nullable(Float',
			'Nullable(Int',
			'Nullable(UInt',
			'Nullable(Decimal',
			'Decimal',
			'Int',
			'Float',
			'UInt'
		]

		let status = false
		for (const n of numbers) {
			if (text && text.includes(n)) {
				status = true
			}
		}
		return status
	}

	const dataTypeIcon = (type: string) => {
		type = type || 'text'
		const ref = type.substring(0, 3).toLowerCase()
		const dt = type.toLowerCase()
		if (type === 'value') {
			return 'typeText'
		} else if (type === 'none') {
			return 'typeInteger'
		} else if (type.includes('json') || type.includes('JSON')) {
			return 'typeJson'
		} else if (type.includes('Array') || type === 'Array') {
			return 'typeArray'
		} else if (type.includes('Float') || type.includes('Decimal')) {
			return 'typeDecimal'
		} else if (
			ref === 'int' ||
			ref === 'flo' ||
			ref === 'dec' ||
			ref === 'num' ||
			ref === 'dou' ||
			dt === 'bigint' ||
			dt === 'smallint' ||
			dt === 'tinyint' ||
			dt === 'mediumint' ||
			dt === 'bit' ||
			isNumberField(type)
		) {
			return 'typeInteger'
		} else if (isDateTime(type)) {
			return 'typeDatetime'
		} else if (isDate(type)) {
			return 'typeDate'
		} else if (dt === 'datetime' || dt === 'timestamp' || dt === 'date' || dt === 'time') {
			return 'typeDate'
		} else {
			return 'typeText'
		}
	}

	const dataTypeName = (dataType: string) => {
		if (dataType) {
			const type = dataType.toLowerCase()

			if (type.includes('array')) {
				return 'array'
			} else if (type.includes('json')) {
				return 'json'
			} else if (type.includes('datetime')) {
				return 'datetime'
			} else if (type.includes('date')) {
				return 'date'
			} else if (type.includes('float')) {
				return 'decimal'
			} else if (type.includes('decimal')) {
				return 'decimal'
			} else if (type.includes('int')) {
				return 'integer'
			} else if (type.includes('uint')) {
				return 'integer'
			} else if (type.includes('uuid')) {
				return 'uuid'
			}
		}
		return 'text'
	}

	return {
		dataTypeIsNumeric: isNumberField,
		dataTypeIsDateTime: isDateTime,
		dataTypeIsFloat: isDecimal,
		dataTypeIsDate: isDate,
		dataTypeIsText: isTextField,
		dataTypeClickhouseNames,
		dataTypeList,
		dataTypeLabel,
		dataTypeIcon,
		dataTypeName
	}
}
