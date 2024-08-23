import { writeFile } from 'fs'
import type { FieldType, GenericType } from '@gaio/types'

export const sleep = (ms: number = 1000) => new Promise((resolve) => setTimeout(resolve, ms))

export const fixBadDataAtJson = (chunk: Record<string, unknown>) => {
    for (const [i] of Object.entries(chunk)) {
        if (chunk[i]) {
            if (chunk[i] === 'NULL') {
                chunk[i] = null
            } else {
                chunk[i] = `${chunk[i]}`
                    .replace(/\\t/g, ' ')
                    .replace(/\t/g, ' ')
                    .replace(/\\r/g, ' ')
                    .replace(/\r/g, ' ')
                    .replace(/\n/g, ' ')
                    .replace(/\\n/g, ' ')
                    .replace(/</g, '')
                    .replace(/>/g, '')
                    .replace(/"/g, `\"`)
                    .replace(/'/g, `\'`)
            }
        }
    }

    return chunk
}

export const generateFile = (path: string, data: string, opts = {}): Promise<{ status: string }> =>
    new Promise((resolve, reject) => {
        writeFile(path, data, opts, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve({ status: 'saved' })
            }
        })
    })

export const createBashScriptEnvRunner = (envKeyName: string, scriptFilePath: string) => {
    return [
        `#!/bin/bash`,
        `eval "$(pyenv init -)"`,
        `eval "$(pyenv virtualenv-init -)"`,
        `pyenv activate ${envKeyName}`,
        `
if python3 ${scriptFilePath} 2>&1 | grep -q "MemoryError"; then
    echo "MemoryError found in the output"
    pyenv deactivate
    exit 1
fi
        `,
        // `python3 ${scriptFilePath}`,
        `pyenv deactivate`
    ].join('\n')
}

export const defineLogComment = (data: GenericType) => {
    const { appId, taskId, userId, type, runningFlowId } = data

    const gaioQt = {
        ref: 'gaio_qt',
        appId: appId || '',
        taskId: taskId || '',
        userId: userId || '',
        type: type || '',
        flowId: runningFlowId || ''
    }

    return {
        queryOptions: {
            log_comment: `${JSON.stringify(gaioQt)}`
        }
    }
}

export const bridgeColumnLength = (field: FieldType) => {
    if (`${field.columnLength}`.includes(',')) {
        const decimalNumber = field.columnLength ? field.columnLength?.split(',') : [2, 2]
        field.columnLength = decimalNumber[decimalNumber.length - 1]
    } else if (`${field.columnLength}`.includes('.')) {
        const decimalNumber = `${field.columnLength}`.split('.')
        field.columnLength = decimalNumber[decimalNumber.length - 1]
    } else {
        field.columnLength = field.columnLength || 2
    }
}

export const arrowDataType = (field: FieldType) => {
    if (!field.dataType) {
        field.dataType = 'Nullable(String)'
    } else if (field.dataType.includes('Array')) {
        return field
    } else if (field.dataType.includes('Decimal') || field.dataType.includes('Float')) {
        field.columnLength = field.columnLength || 2
        bridgeColumnLength(field)
        field.dataType = `Nullable(Float64)`
    } else {
        field.dataType =
            clickHouseDataTypeReference[field.dataType] ? clickHouseDataTypeReference[field.dataType]
            : clickHouseDataTypeReference[lowerType(field.dataType)] ?
                clickHouseDataTypeReference[lowerType(field.dataType)]
            :   'Nullable(String)'

        if (field.dataType?.includes('Decimal')) {
            field.dataType = `Nullable(Float64)`
        }
    }
    return field
}

export const lowerType = (dataType: string) => {
    return dataType
        .toLowerCase()
        .replace(/\(([^)]+)\)/, '')
        .replace('()', '')
        .replace(/\s/g, '')
        .replace('unsigned', '')
        .replace('zerofill', '')
        .trim()
}

export const clickHouseDataTypeReference: { [key: string]: string } = {
    int: 'Nullable(Int64)',
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
    int2: 'Nullable(Int64)',
    int4: 'Nullable(Int64)',
    int8: 'Nullable(Int64)',
    float4: 'Nullable(Float64)',
    float8: 'Nullable(Float64)',
    float: 'Nullable(Float64)',
    Decimal: 'Nullable(Float64)',
    decimal: 'Nullable(Float64)',
    Float32: 'Nullable(Float64)',
    Float64: 'Nullable(Float64)',
    binary_float: 'Nullable(Float64)',
    binary_double: 'Nullable(Float64)',
    double: 'Nullable(Float64)',
    smalldecimal: 'Nullable(Float64)',
    fixed: 'Nullable(Float64)',
    bit: 'Nullable(Int64)',
    integer: 'Nullable(Int64)',
    tinyint: 'Nullable(Int64)',
    smallint: 'Nullable(Int64)',
    mediumint: 'Nullable(Int64)',
    uuid: 'Nullable(UUID)',
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
    seconddate: 'Nullable(DateTime)',
    bfile: 'Nullable(String)',
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
    'Nullable(Decimal64)': 'Nullable(Float64)',
    'Nullable(Decimal32)': 'Nullable(Float64)',
    'Nullable(Decimal128)': 'Nullable(Float64)',
    'Nullable(UInt8)': 'Nullable(Int64)',
    'Nullable(UInt16)': 'Nullable(Int64)',
    'Nullable(UInt32)': 'Nullable(Int64)',
    'Nullable(UInt64)': 'Nullable(Int64)',
    'Nullable(FixedString)': 'Nullable(String)',
    'Nullable(String)': 'Nullable(String)',
    'Nullable(Array)': 'Array',
    Int8: 'Nullable(Int64)',
    Int16: 'Nullable(Int64)',
    Int32: 'Nullable(Int64)',
    Int64: 'Nullable(Int64)',
    Date: 'Nullable(Date)',
    datetime: 'Nullable(DateTime)',
    Datetime: 'Nullable(DateTime)',
    Datetime64: 'Nullable(DateTime)',
    UInt8: 'Nullable(Int64)',
    UInt16: 'Nullable(Int64)',
    UInt32: 'Nullable(Int64)',
    UInt64: 'Nullable(Int64)',
    FixedString: 'Nullable(String)',
    String: 'Nullable(String)',
    Array: 'Nullable(Array)',
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
    decfloat: 'Nullable(Float64)',
    'Nullable(Float64)': 'Nullable(Float64)'
}
