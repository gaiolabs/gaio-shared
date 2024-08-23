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

export const replacement = {
    bool: 'Nullable(Int64)',
    boolean: 'Nullable(Int64)',
    nvarchar: 'Nullable(String)',
    'national char': 'Nullable(String)',
    'national char varying': 'Nullable(String)',
    'national character varying': 'Nullable(String)',
    'national varchar varying': 'Nullable(String)',
    'national varchar': 'Nullable(String)',
    char: 'Nullable(String)',
    varbinary: 'Nullable(String)',
    binary: 'Nullable(String)',
    dec: 'Nullable(Float64)',
    numeric: 'Nullable(Float64)',
    int2: 'Nullable(Float64)',
    int4: 'Nullable(Float64)',
    int8: 'Nullable(Float64)',
    float4: 'Nullable(Float64)',
    float8: 'Nullable(Float64)',
    fixed: 'Nullable(Float64)',
    bit: 'Nullable(Int64)',
    integer: 'Nullable(Int64)',
    tinyint: 'Nullable(Int64)',
    smalldecimal: 'Nullable(Float64)',
    smallint: 'Nullable(Int64)',
    mediumint: 'Nullable(Int64)',
    // uuid: 'Nullable(UUID)',
    'Array(Nullable(String))': 'Array(Nullable(String))',
    'Array(Nullable(Float64))': 'Array(Nullable(Float64))',
    Json: 'json',
    JSON: 'json',
    json: 'json',
    "Object('json')": 'json',
    bigint: 'Nullable(Int64)',
    'varying character': 'Nullable(String)',
    'timestamp with time zone': 'Nullable(DateTime)',
    'timestamp with local time zone': 'Nullable(DateTime)',
    'interval year to month': 'Nullable(String)',
    'interval day to second': 'Nullable(String)',
    timestamptz: 'Nullable(DateTime)',
    timetz: 'Nullable(DateTime)',
    'native character': 'Nullable(String)',
    interval: 'Nullable(String)',
    seconddate: 'Nullable(String)',
    bfile: 'Nullable(String)',
    binary_float: 'Nullable(Float64)',
    binary_double: 'Nullable(Float64)',
    // start db
    'Nullable(Int8)': 'Nullable(Int64)',
    'Nullable(Int16)': 'Nullable(Int64)',
    'Nullable(Int32)': 'Nullable(Int64)',
    'Nullable(Int64)': 'Nullable(Int64)',
    'Nullable(Date)': 'Nullable(Date)',
    'Nullable(DateTime)': 'Nullable(DateTime)',
    'Nullable(Datetime)': 'Nullable(DateTime)',
    'Nullable(Datetime64)': 'Nullable(DateTime)',
    'Nullable(Decimal)': 'Nullable(Float64)',
    'Nullable(Float32)': 'Nullable(Float64)',
    'Nullable(Float64)': 'Nullable(Float64)',
    'Nullable(UInt8)': 'Nullable(Int64)',
    'Nullable(UInt16)': 'Nullable(Int64)',
    'Nullable(UInt32)': 'Nullable(Int64)',
    'Nullable(UInt64)': 'Nullable(Int64)',
    'Nullable(FixedString)': 'Nullable(String)',
    'Nullable(String)': 'Nullable(String)',
    'Nullable(Array)': 'Nullable(Array)',
    Int8: 'Nullable(Int64)',
    Int16: 'Nullable(Int64)',
    Int32: 'Nullable(Int64)',
    Int64: 'Nullable(Int64)',
    Date: 'Nullable(Date)',
    datetime: 'Nullable(DateTime)',
    Datetime: 'Nullable(DateTime)',
    Datetime64: 'Nullable(DateTime)',
    Decimal: 'Nullable(Float64)',
    Float32: 'Nullable(Float64)',
    Float64: 'Nullable(Float64)',
    UInt8: 'Nullable(Int64)',
    UInt16: 'Nullable(Int64)',
    UInt32: 'Nullable(Int64)',
    UInt64: 'Nullable(Int64)',
    FixedString: 'Nullable(String)',
    String: 'Nullable(String)',
    Array: 'Array',
    // end db
    blob: 'Nullable(String)',
    character: 'Nullable(String)',
    clob: 'Nullable(String)',
    nclob: 'Nullable(String)',
    date: 'Nullable(Date)',
    'double precision': 'Nullable(Float64)',
    long: 'Nullable(String)',
    'long raw': 'Nullable(String)',
    nchar: 'Nullable(String)',
    'char varying': 'Nullable(String)',
    'nchar varying': 'Nullable(String)',
    'time with time zone': 'Nullable(DateTime)',
    'time without time zone': 'Nullable(DateTime)',
    'timestamp without time zone': 'Nullable(DateTime)',
    number: 'Nullable(Float64)',
    nvarchar2: 'Nullable(String)',
    raw: 'Nullable(String)',
    real: 'Nullable(Float64)',
    rowid: 'Nullable(String)',
    urowid: 'Nullable(String)',
    varchar2: 'Nullable(String)',
    alphanum: 'Nullable(String)',
    shorttext: 'Nullable(String)',
    string: 'Nullable(String)',
    xmltype: 'Nullable(String)',
    xml: 'Nullable(String)',
    timestamp: 'Nullable(DateTime)',
    datetime2: 'Nullable(DateTime)',
    datetimeoffset: 'Nullable(DateTime)',
    image: 'Nullable(String)',
    money: 'Nullable(Float64)',
    ntext: 'Nullable(String)',
    rowversion: 'Nullable(String)',
    smalldatetime: 'Nullable(DateTime)',
    smallmoney: 'Nullable(Float64)',
    uniqueidentifier: 'Nullable(String)',
    decfloat: 'Nullable(Float64)'
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

export const bridgeDataType = (field, pureDecimal = false) => {
    if (field.dataType.includes('Array')) {
        if (field.arrayDataType === 'Numeric') {
            // field.dataType = `Array(Nullable(Float64))`;
        } else if (field.arrayDataType === 'String') {
            // field.dataType = `Array(Nullable(String))`;
        }
    } else if (!field.dataType) {
        field.dataType = 'Nullable(String)'
    } else if (field.dataType.includes('Decimal') || field.dataType.includes('Float')) {
        bridgeColumnLength(field)
        field.dataType = `Nullable(Float64)`
    } else {
        field.dataType =
            replacement[field.dataType] ? replacement[field.dataType]
            : replacement[lowerType(field.dataType)] ? replacement[lowerType(field.dataType)]
            : 'Nullable(String)'

        if (field.dataType.includes('Decimal')) {
            field.dataType = `Nullable(Float64)`
        }
    }

    return field
}
