import type { CommonBuilderTaskType, FieldType, GenericValueType, ParamType } from '@gaio/types'
import knex, { type Knex } from 'knex'
import { isArray, isNil, isNumber } from 'lodash-es'
import { TemplateService } from '../../../shared/template.service'

export class InsertService {
    private template = new TemplateService()

    private static getValueFromParameter(value: unknown) {
        return value !== 0 && value !== '0' ? value || '' : '0'
    }

    private static castValue(field: FieldType, value: GenericValueType, k: Knex) {
        if (field.dataType.includes('Date')) {
            if (field.dataType.includes('Nullable')) {
                return k.raw(`parseDateTimeBestEffortOrNull('${value || ''}')`)
            }
            return k.raw(`parseDateTimeBestEffort('${value}')`)
        } else if (field.dataType.includes('Float') || field.dataType.includes('Decimal')) {
            if (field.dataType.includes('Nullable')) {
                if (isNil(value)) {
                    return k.raw(`null`)
                } else if (isNumber(Number(value))) {
                    return k.raw(
                        `floor(toFloat64OrNull('${this.getValueFromParameter(value)}'), ${field.columnLength || 2})`
                    )
                }
                return k.raw(`null`)
            }
            return k.raw(`floor(toFloat64OrNull('${this.getValueFromParameter(value)}')), ${field.columnLength || 2})`)
        } else if (field.dataType.includes('Int') || field.dataType.includes('Uni')) {
            if (field.dataType.includes('Nullable')) {
                if (isNil(value)) {
                    return k.raw(`null`)
                } else if (isNumber(Number(value))) {
                    return k.raw(`round(toFloat64OrNull('${this.getValueFromParameter(value)}'),0)`)
                }
                return k.raw(`null`)
            }
            return k.raw(`floor(toFloat64OrNull('${this.getValueFromParameter(value)}'), 0)`)
        } else {
            if (value === 0) {
                return '0'
            } else if (value) {
                return `${value}`
            }
            return k.raw(`null`)
        }
    }

    public build(taskData: CommonBuilderTaskType, params: ParamType[], builder: Knex.QueryBuilder) {
        const schema = taskData.schema

        const k = knex({
            client: 'mysql'
        })
        const toInsert = schema.insert.reduce((obj, field) => {
            let value: Knex.Raw<string> | null | string
            if (field.valueType === 'computed') {
                value = k.raw(`${this.template.render(field.content, params)}`)
            } else if (field.valueType === 'parameter') {
                const p = params.find((o) => o.paramName === field.value)
                value = p ? InsertService.castValue(field, p.paramValue, k) : null
            } else {
                value = InsertService.castValue(field, field.value, k)
            }
            obj[field.alias || field.columnName] = value
            return obj
        }, {})

        builder.insert(toInsert)
        return builder
    }

    private static transformValue(field: FieldType, value: GenericValueType) {
        return (
            (
                [
                    'Int',
                    'Int8',
                    'Int16',
                    'Int32',
                    'Int64',
                    'Decimal',
                    'UInt8',
                    'UInt16',
                    'UInt32',
                    'UInt64',
                    'Float',
                    'Float32',
                    'Float64',
                    'Float128',
                    'Decimal',
                    'Decimal32',
                    'Decimal64',
                    'Decimal128'
                ].includes(`${field.dataType}`.replace('Nullable(', '').replace(')', ''))
            ) ?
                isArray(value) ? value.map((o) => Number(o)).filter((o) => !isNil(o))
                : isNaN(Number(value)) ? value || ''
                : isNil(value) ? null
                : Number(value)
            :   value || ''
        )
    }

    private getValueFromParameter(parameters: ParamType[], field: FieldType, type: string) {
        // I KNOW, I KNOW, FIELD IS BEING MUTATED :(

        const param = parameters.find((o) => o.paramName === field[type])
        let isFunction = false
        let k

        if (!param) {
            return ''
        }

        param.paramValue = InsertService.transformValue(field, param.paramValue) as string

        if (!isNumber(param.paramValue)) {
            param.paramValue = param.paramValue || ''
        }

        if (param.all && param.paramValue === '') {
            field.operator = 'all'
        } else if (isArray(param.paramValue)) {
            if (
                param.paramValue.some((o) => o === 'all_' || (isArray(o) && o.includes('all_'))) ||
                param.paramValue.length <= 0
            ) {
                field.operator = 'all'
                field.value = ''
            } else {
                field.operator = 'in'
            }
        } else if (param.paramValue === 'all_') {
            field.operator = 'all'
        } else if (`${param.paramValue}`.trim().startsWith('{{')) {
            // field.functionOperator = cloneDeep(field.operator);
            // field.operator = 'function';
            k = knex({
                client: 'mysql'
            })
            isFunction = true
        }

        return isFunction ? k.raw(param.paramValue?.replace(/\{{|}}/gi, '')) : param.paramValue
    }
}
