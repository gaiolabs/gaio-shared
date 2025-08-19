import {FieldType} from "../../types";

export const dataTypeList = [
    'Nullable(String)',
    'Nullable(Int64)',
    'Nullable(Float64)',
    'Nullable(Date)',
    'Nullable(DateTime)',
    'Array',
    'JSON'
]

export const dataTypeListLabel = (type) => {
    if (type && type.includes('Decimal')) {
        return 'Decimal'
    } else {
        return replacement[type] || 'Nullable(String)'
    }
}

export const hasColumnLength = ['Nullable(Float64)', 'Nullable(Decimal64)']

export const replacement:  { [key: string]: string } = {
    Array: 'Nullable(Array)',
    'Array(Nullable(Float64))': 'Array(Float64)',
    'Array(Nullable(String))': 'Array(String)',
    Date: 'Nullable(Date)',
    Datetime: 'Nullable(DateTime)',
    Datetime64: 'Nullable(DateTime)',
    Decimal: 'Nullable(Decimal64)',
    FixedString: 'Nullable(String)',
    Float32: 'Nullable(Float64)',
    Float64: 'Nullable(Float64)',
    Int16: 'Nullable(Int64)',
    Int32: 'Nullable(Int64)',
    Int64: 'Nullable(Int64)',
    Int8: 'Nullable(Int64)',
    JSON: 'json',
    Json: 'json',
    'Nullable(Array)': 'Array',
    'Nullable(Date)': 'Nullable(Date)',
    'Nullable(DateTime)': 'Nullable(DateTime)',
    'Nullable(Datetime)': 'Nullable(DateTime)',
    'Nullable(Datetime64)': 'Nullable(DateTime)',
    'Nullable(Decimal)': 'Nullable(Decimal64)',
    'Nullable(Decimal128)': 'Nullable(Decimal64)',
    'Nullable(Decimal32)': 'Nullable(Decimal64)',
    'Nullable(Decimal64)': 'Nullable(Decimal64)',
    'Nullable(FixedString)': 'Nullable(String)',
    'Nullable(Float32)': 'Nullable(Float64)',
    'Nullable(Float64)': 'Nullable(Float64)',
    'Nullable(Int16)': 'Nullable(Int64)',
    'Nullable(Int32)': 'Nullable(Int64)',
    'Nullable(Int64)': 'Nullable(Int64)',
    'Nullable(Int8)': 'Nullable(Int64)',
    'Nullable(String)': 'Nullable(String)',
    'Nullable(UInt16)': 'Nullable(Int64)',
    'Nullable(UInt32)': 'Nullable(Int64)',
    'Nullable(UInt64)': 'Nullable(Int64)',
    'Nullable(UInt8)': 'Nullable(Int64)',
    "Object('json')": 'json',
    String: 'Nullable(String)',
    UInt16: 'Nullable(Int64)',
    UInt32: 'Nullable(Int64)',
    UInt64: 'Nullable(Int64)',
    UInt8: 'Nullable(Int64)',
    alphanum: 'Nullable(String)',
    bfile: 'Nullable(String)',
    bigint: 'Nullable(Int64)',
    binary: 'Nullable(String)',
    binary_double: 'Nullable(Float64)',
    binary_float: 'Nullable(Float64)',
    bit: 'Nullable(Int64)',
    blob: 'Nullable(String)',
    bool: 'Nullable(String)',
    boolean: 'Nullable(String)',
    char: 'Nullable(String)',
    'char varying': 'Nullable(String)',
    character: 'Nullable(String)',
    clob: 'Nullable(String)',
    date: 'Nullable(Date)',
    datetime: 'Nullable(DateTime)',
    datetime2: 'Nullable(DateTime)',
    datetimeoffset: 'Nullable(DateTime)',
    dec: 'Nullable(Decimal64)',
    decfloat: 'Nullable(Float64)',
    decimal: 'Nullable(Decimal64)',
    double: 'Nullable(Float64)',
    'double precision': 'Nullable(Float64)',
    fixed: 'Nullable(Decimal64)',
    float: 'Nullable(Float64)',
    float4: 'Nullable(Float64)',
    float8: 'Nullable(Float64)',
    image: 'Nullable(String)',
    int: 'Nullable(Int64)',
    int2: 'Nullable(Int64)',
    int4: 'Nullable(Int64)',
    int8: 'Nullable(Int64)',
    integer: 'Nullable(Int64)',
    interval: 'Nullable(String)',
    'interval day to second': 'Nullable(String)',
    'interval year to month': 'Nullable(String)',
    json: 'json',
    long: 'Nullable(String)',
    'long raw': 'Nullable(String)',
    mediumint: 'Nullable(Int64)',
    money: 'Nullable(Float64)',
    'national char': 'Nullable(String)',
    'national char varying': 'Nullable(String)',
    'national character varying': 'Nullable(String)',
    'national varchar': 'Nullable(String)',
    'national varchar varying': 'Nullable(String)',
    'native character': 'Nullable(String)',
    nchar: 'Nullable(String)',
    'nchar varying': 'Nullable(String)',
    nclob: 'Nullable(String)',
    ntext: 'Nullable(String)',
    number: 'Nullable(Decimal64)',
    numeric: 'Nullable(Decimal64)',
    nvarchar: 'Nullable(String)',
    nvarchar2: 'Nullable(String)',
    raw: 'Nullable(String)',
    real: 'Nullable(Decimal64)',
    rowid: 'Nullable(String)',
    rowversion: 'Nullable(String)',
    seconddate: 'Nullable(DateTime)',
    shorttext: 'Nullable(String)',
    smalldatetime: 'Nullable(DateTime)',
    smalldecimal: 'Nullable(Decimal64)',
    smallint: 'Nullable(Int64)',
    smallmoney: 'Nullable(Decimal64)',
    string: 'Nullable(String)',
    'time with time zone': 'Nullable(DateTime)',
    'time without time zone': 'Nullable(DateTime)',
    timestamp: 'Nullable(DateTime)',
    'timestamp with local time zone': 'Nullable(DateTime)',
    'timestamp with time zone': 'Nullable(DateTime)',
    'timestamp without time zone': 'Nullable(DateTime)',
    timestamptz: 'Nullable(DateTime)',
    timetz: 'Nullable(DateTime)',
    tinyint: 'Nullable(Int64)',
    uniqueidentifier: 'Nullable(String)',
    urowid: 'Nullable(String)',
    uuid: 'Nullable(UUID)',
    varbinary: 'Nullable(String)',
    varchar2: 'Nullable(String)',
    'varying character': 'Nullable(String)',
    xml: 'Nullable(String)',
    xmltype: 'Nullable(String)'
}

export const lowerType = (dataType) => {
    return dataType
        .toLowerCase()
        .replace(/\(([^)]+)\)/, '')
        .replace('()', '')
        .replace(/\s/g, '')
        .replace('unsigned', '')
        .replace('zerofill', '')
        .trim()
}

export const bridgeColumnLength = (field) => {
    if (`${field.columnLength}`.includes(',')) {
        const decimalNumber = field.columnLength.split(',')
        field.columnLength = decimalNumber[decimalNumber.length - 1]
    } else if (`${field.columnLength}`.includes('.')) {
        const decimalNumber = `${field.columnLength}`.split('.')
        field.columnLength = decimalNumber[decimalNumber.length - 1]
    } else {
        field.columnLength = field.columnLength || 2
    }
}

export const bridgeDataType = (field: FieldType, pureDecimal = false) => {
    if (field.dataType.includes('Array')) {
        if (field.arrayDataType === 'Numeric') {
            // field.dataType = `Array(Nullable(Float64))`;
        } else if (field.arrayDataType === 'String') {
            // field.dataType = `Array(Nullable(String))`;
        }
    } else if (field.dataType.toLowerCase().includes('json')){
        field.dataType = 'Nullable(JSON)'
        field.columnLength = null
    } else if (!field.dataType) {
        field.dataType = 'Nullable(String)'
    } else if (field.dataType.includes('Decimal')) {
        bridgeColumnLength(field)
        field.dataType = `Nullable(Decimal64)`
    } else {
        field.dataType =
            replacement[field.dataType] ? replacement[field.dataType]
            : replacement[lowerType(field.dataType)] ? replacement[lowerType(field.dataType)]
            : 'Nullable(String)'

        if (field.dataType.toLowerCase().includes('decimal')) {
            field.dataType = `Nullable(Decimal64)`
        }
    }

    return field
}
