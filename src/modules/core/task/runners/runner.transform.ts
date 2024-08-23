import type { BuilderTaskType } from '@gaio/types'

const getValueFromParameter = (value) => {
    return value !== 0 && value !== '0' ? value || '' : '0'
}

export const checkType = (dataType = 'String') => {
    const baseTypes = {
        'Nullable(Int8)': 'Integer',
        'Nullable(Int16)': 'Integer',
        'Nullable(Int32)': 'Integer',
        'Nullable(Int64)': 'Integer',
        'Nullable(Date)': 'Date',
        'Nullable(DateTime)': 'Datetime',
        'Nullable(Datetime)': 'Datetime',
        'Nullable(Datetime64)': 'Datetime',
        'Nullable(Decimal)': 'Decimal',
        'Nullable(Decimal64)': 'Decimal',
        'Nullable(Float32)': 'Decimal',
        'Nullable(Float64)': 'Decimal',
        'Nullable(Float128)': 'Decimal',
        'Nullable(UInt8)': 'Integer',
        'Nullable(UInt16)': 'Integer',
        'Nullable(UInt32)': 'Integer',
        'Nullable(UInt64)': 'Integer',
        'Nullable(FixedString)': 'String',
        'Nullable(String)': 'String',
        'Nullable(Double)': 'String',
        Int8: 'Integer',
        Int16: 'Integer',
        Int32: 'Integer',
        Int64: 'Integer',
        Date: 'Date',
        Datetime: 'Datetime',
        Datetime64: 'Datetime',
        Decimal: 'Decimal',
        Float32: 'Decimal',
        Float64: 'Decimal',
        Float128: 'Decimal',
        UInt8: 'Integer',
        UInt16: 'Integer',
        UInt32: 'Integer',
        UInt64: 'Integer',
        FixedString: 'String',
        String: 'String',
        Double: 'Decimal',
        UUID: 'UUID'
    }

    if (baseTypes[dataType] === 'String' || baseTypes[dataType] === 'UUID') {
        return 'String'
    } else if (dataType.includes('Decimal')) {
        return 'Decimal'
    }

    return baseTypes[dataType]
}

export const transform = <T extends BuilderTaskType>(taskData: T) => {
    const alreadyNumeric = (dataType = 'Decimal') => {
        return checkType(dataType) === 'Decimal' || checkType(dataType) === 'Integer'
    }

    const select = []
    for (const item of taskData.columns) {
        if (item.toDataType !== 'none') {
            // to mutation table, cast must be current type, then use MODIFY command to exchange
            const castType = taskData.transformType === 'mutation' ? item.dataType : item.toDataType
            let sel = ''

            // Integer
            if (checkType(item.toDataType) === 'Integer') {
                if (item.extraOne === 'comma' && !alreadyNumeric(item.dataType)) {
                    sel = `replaceAll(replaceAll(toString(${item.columnName}), '.', ''), ',', '.')`
                } else if (item.extraOne === 'dot' && !alreadyNumeric(item.dataType)) {
                    sel = `replaceAll(toString(${item.columnName}), ',', '')`
                } else {
                    sel = `toString(${item.columnName})`
                }
                switch (item.transform) {
                    case 'bestEffort':
                        sel = `cast(toInt64(${sel}) as ${castType})`
                        break
                    case 'bestEffortOrZero':
                        sel = `cast(toInt64OrZero(${getValueFromParameter(sel)}) as ${castType})`
                        break
                    case 'bestEffortOrNull':
                        sel = `cast(toInt64OrNull(${getValueFromParameter(sel)}) as ${castType})`
                        break
                }
                // Decimal
            } else if (checkType(item.toDataType) === 'Decimal') {
                if (item.extraOne === 'comma' && !alreadyNumeric(item.dataType)) {
                    sel = `replaceAll(replaceAll(toString(${item.columnName}), '.', ''), ',', '.')`
                } else if (item.extraOne === 'dot' && !alreadyNumeric(item.dataType)) {
                    sel = `replaceAll(toString(${item.columnName}), ',', '')`
                } else {
                    sel = `toString(${item.columnName})`
                }
                switch (item.transform) {
                    case 'bestEffort':
                        sel = `cast(floor(toFloat64OrNull(${getValueFromParameter(sel)}), ${
                            item.extraTwo || 2
                        }) as ${castType})`
                        break
                    case 'bestEffortOrZero':
                        sel = `cast(floor(toFloat64OrZero(${getValueFromParameter(sel)}), ${
                            item.extraTwo || 2
                        }) as ${castType})`
                        break
                    case 'bestEffortOrNull':
                        sel = `cast(floor(toFloat64OrNull(${getValueFromParameter(sel)}), ${
                            item.extraTwo || 2
                        }) as ${castType})`
                        break
                }
                // Date
            } else if (checkType(item.toDataType) === 'Date') {
                switch (item.transform) {
                    case 'bestEffort':
                        sel = `cast(toDate(parseDateTimeBestEffort(${item.columnName})) as ${castType})`
                        break
                    case 'bestEffortOrZero':
                        sel = `cast(toDate(parseDateTimeBestEffortOrZero(${item.columnName})) as ${castType})`
                        break
                    case 'bestEffortOrNull':
                        sel = `cast(toString(toDate(parseDateTimeBestEffortOrNull(${item.columnName}))) as ${castType})`
                        break
                }
            } else if (checkType(item.toDataType) === 'Datetime') {
                switch (item.transform) {
                    case 'bestEffort':
                        sel = `cast(parseDateTimeBestEffort(${item.columnName}) as ${castType})`
                        break
                    case 'bestEffortOrZero':
                        sel = `cast(parseDateTimeBestEffortOrZero(${item.columnName}) as ${castType})`
                        break
                    case 'bestEffortOrNull':
                        sel = `cast(parseDateTimeBestEffortOrNull(${item.columnName}) as ${castType})`
                        break
                }
            } else {
                switch (item.transform) {
                    case 'replaceRegexpOne':
                        sel = `cast(replaceRegexpOne(toString(${item.columnName}), '${item.extraOne}', '${item.extraTwo}') as Nullable(String))`
                        break
                    case 'replaceRegexpAll':
                        sel = `cast(replaceRegexpAll(toString(${item.columnName}), '${item.extraOne}', '${item.extraTwo}') as Nullable(String))`
                        break
                    default:
                        sel = `cast(toString(${item.columnName}) as Nullable(String))`
                        break
                }
            }
            select.push({
                columnName: item.columnName,
                dataType: item.dataType,
                toDataType: item.toDataType,
                mutation: sel
            })
        }
    }
    return select
}
