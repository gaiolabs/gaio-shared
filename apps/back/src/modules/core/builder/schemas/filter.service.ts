import type { CommonBuilderTaskType, FieldType, GenericType, GenericValueType, ParamType } from '@gaio/types'
import type { Knex } from 'knex'
import knex from 'knex'
import { isNumber, isArray, isNil } from 'lodash-es'
import { convertDateLiteral, isDateLiteral } from '../../../../utils'
import { TemplateService } from '../../../shared/template.service'

export class FilterService {
    template = new TemplateService()

    static transformValue(field: FieldType, value: unknown) {
        if (value === 'all_') return 'all_'
        return (
            FilterService.isNumeric(field) ?
                isArray(value) ? value.map((o) => Number(o)).filter((o) => !isNil(o))
                : !value && value !== 0 ? null
                : isNil(value) ? null
                : isNaN(Number(value)) ? null
                : Number(value)
            :   value || '') as string
    }

    public build(taskData: CommonBuilderTaskType, parameters: ParamType[], builder: Knex.QueryBuilder) {
        const self = this
        const schema = taskData.schema

        schema.filter.forEach((fil) => {
            if (fil.andOr && fil.andOr === 'or') {
                builder.orWhere((whrBuild) => {
                    self.whereRules(taskData, whrBuild, fil.list, parameters)
                })
            } else {
                builder.where((whrBuild) => {
                    self.whereRules(taskData, whrBuild, fil.list, parameters)
                })
            }
        })
        return builder
    }

    whereRules(
        taskData: CommonBuilderTaskType,
        builder: Knex | Knex.QueryBuilder,
        list: GenericType[],
        parameters: ParamType[]
    ) {
        list.forEach((field) => {
            let value: string
            let extraValue: string
            let column: string

            const forceTableName = (field: FieldType, columnName: string) => {
                if (field.forceTableName && !columnName.startsWith(`${field.tableName}.`)) {
                    return `${field.tableName}.${columnName}`
                }
                return columnName
            }

            // SET FIELD ALIAS, IF NEEDED
            if (field.type === 'computed' || field.computedId) {
                column = this.renderTemplate(taskData, parameters, field.content as string, field.columnName as string)
            } else {
                column = (
                    field.alias && field.alias !== '' ?
                        field.alias
                    :   field.tableName + '.' + field.columnName) as string
                column = forceTableName(field, column)
            }

            // SET VALUE
            if (isDateLiteral(field.value)) {
                value = this.renderDateLiteral(taskData, field.value as string)

                if (field.extraValue) {
                    extraValue = this.renderDateLiteral(taskData, field.extraValue as string)
                }
            } else {
                switch (field.valueType) {
                    case 'computed':
                        value = this.renderTemplate(taskData, parameters, field.value as string, column)
                        if (field.extraValue) {
                            extraValue = this.renderTemplate(taskData, parameters, field.extraValue as string, column)
                        }
                        break
                    case 'parameter':
                        value = this.getValueFromParameter(parameters, field, 'value')
                        if (field.extraValue) {
                            extraValue = this.getValueFromParameter(parameters, field, 'extraValue')
                        }
                        break
                    default:
                        value = FilterService.transformValue(field, field.value).toString()
                        if (field.extraValue) {
                            extraValue = FilterService.transformValue(field, field.extraValue)
                        }
                        break
                }
            }

            this.loadBuilder(builder as Knex, field, column, value, extraValue, taskData.clickhouse)
        })

        return builder
    }

    loadBuilder(
        builder: Knex,
        field: FieldType,
        column: string,
        value: GenericValueType,
        extraValue: GenericValueType,
        clickhouse: boolean
    ) {
        // SET BUILDER

        // MAKE SURE VALUE IS ALWAYS AN STRING
        // value = isArray(value) ? value.toString() : value;

        //     field.value = ;

        switch (field.operator) {
            case 'all':
                builder.whereRaw(`(${column} is not null OR ${column} is null)`)
                break
            case 'function':
                builder.whereRaw(
                    `(${column} ${field.functionOperator}  ${field.value
                        .replace(/\{{|}}/gi, '')
                        .replace(/&#39;/g, "'")})`
                )
                break
            case 'isNull':
                if (field.andOr === 'and') {
                    builder.whereNull(column)
                } else {
                    builder.orWhereNull(column)
                }
                break
            case 'isNotNull':
                if (field.andOr === 'and') {
                    builder.whereNotNull(column)
                } else {
                    builder.orWhereNotNull(column)
                }
                break
            case 'in':
                if (field.andOr === 'and') {
                    builder.whereIn(column, this.whereInType(value))
                } else {
                    builder.orWhereIn(column, this.whereInType(value))
                }
                break
            case 'notIn':
                if (field.andOr === 'and') {
                    builder.whereNotIn(column, this.whereInType(value))
                } else {
                    builder.orWhereNotIn(column, this.whereInType(value))
                }
                break
            case 'between':
                if (
                    field.valueType !== 'computed' &&
                    !field.isFunction &&
                    (`${field.dataType}`.includes('Flot') || `${field.dataType}`.includes('Decimal'))
                ) {
                    extraValue = isNumber(Number(extraValue)) ? Number(extraValue) : extraValue || '' // make second sure value exists
                }
                if (field.andOr === 'and') {
                    builder.whereBetween(column, [value, extraValue])
                } else {
                    builder.orWhereBetween(column, [value, extraValue])
                }
                break
            case 'notBetween':
                if (field.valueType !== 'computed' && !field.isFunction) {
                    extraValue = isNumber(Number(extraValue)) ? Number(extraValue) : extraValue || '' // make second sure value exists
                }
                if (field.andOr === 'and') {
                    builder.whereNotBetween(column, [value, extraValue])
                } else {
                    builder.orWhereNotBetween(column, [value, extraValue])
                }
                break
            case 'like':
                if (field.andOr === 'and') {
                    builder.where(column, 'like', `%${value}%`)
                } else {
                    builder.orWhere(column, 'like', `%${value}%`)
                }
                break
            case 'notLike':
                if (field.andOr === 'and') {
                    builder.where(column, 'not like', `%${value}%`)
                } else {
                    builder.orWhere(column, 'not like', `%${value}%`)
                }
                break

            case 'startsWith':
                if (field.andOr === 'and') {
                    builder.where(column, 'like', `${value}%`)
                } else {
                    builder.orWhere(column, 'like', `${value}%`)
                }
                break
            case 'doesNotStartsWith':
                if (field.andOr === 'and') {
                    builder.where(column, 'not like', `${value}%`)
                } else {
                    builder.orWhere(column, 'not like', `${value}%`)
                }
                break

            case 'endsWith':
                if (field.andOr === 'and') {
                    builder.where(column, 'like', `%${value}`)
                } else {
                    builder.orWhere(column, 'like', `%${value}`)
                }
                break
            case 'doesNotEndsWith':
                if (field.andOr === 'and') {
                    builder.where(column, 'not like', `%${value}`)
                } else {
                    builder.orWhere(column, 'not like', `%${value}`)
                }
                break
            case '!=':
                if (clickhouse) {
                    if (field.andOr === 'and') {
                        builder.whereNotIn(column, this.whereInType(value))
                    } else {
                        builder.orWhereNotIn(column, this.whereInType(value))
                    }
                } else {
                    if (field.andOr === 'and') {
                        builder.where(column, field.operator, value)
                    } else {
                        builder.orWhere(column, field.operator, value)
                    }
                }
                break
            default:
                if (field.andOr === 'and') {
                    builder.where(column, field.operator, value)
                } else {
                    builder.orWhere(column, field.operator, value)
                }
                break
        }

        return builder
    }

    whereInType(value: unknown): unknown[] {
        if (isArray(value)) {
            return value
        } else if (typeof value === 'string') {
            const list = value.split(',')
            list.forEach((item, index) => {
                list[index] = item ? item.trim() : ''
            })
            return list || []
        } else {
            return value as unknown[]
        }
    }

    getValueFromParameter(parameters: ParamType[], field: FieldType, type: string) {
        // I KNOW, I KNOW, FIELD IS BEING MUTATED :(
        const param = parameters.find((o) => o.paramName === field[type]) || ({} as ParamType)
        let isFunction = false

        if (!param.paramValue) {
            return null
        }

        const k = knex({
            client: 'mysql'
        })

        if (!(isArray(param.paramValue) && param.paramValue[0] === 'all_')) {
            if (
                FilterService.isNumeric(field) &&
                param.paramValue !== 'all_' &&
                !`${param.paramValue}`.trim().startsWith('{{')
            ) {
                param.paramValue = FilterService.transformValue(field, param.paramValue) as string
            }
        }

        if (
            (param.all && param.paramValue === '') ||
            (param.all && param.paramValue === 'all_') ||
            (param.all && `${param.paramValue}` !== '0' && !param.paramValue)
        ) {
            field.operator = 'all'
        } else if (isArray(param.paramValue)) {
            if (
                param.paramValue.some(
                    (o) => o === 'all_' || (isArray(o) && o.includes('all_')) || (isArray(o) && o.length <= 0)
                ) ||
                param.paramValue.length <= 0 ||
                param.paramValue[0] === 'all_'
            ) {
                field.operator = 'all'
                field.value = ''
            } else if (field.operator === 'notIn') {
                field.operator = 'notIn'
            } else {
                field.operator = 'in'
            }
        } else if (param.paramValue === 'all_') {
            field.operator = 'all'
        } else if (`${param.paramValue}`.trim().startsWith('{{')) {
            isFunction = true
        }

        field.isFunction = isFunction
        field[type] = isFunction ? k.raw(param.paramValue?.replace(/\{{|}}/gi, '')) : param.paramValue

        if (Number(field[type]) === 0 || field[type] === '0') {
            return field[type]
        }

        return field[type] || null
    }

    renderDateLiteral(taskData: CommonBuilderTaskType, value: string) {
        const k = knex({
            client: taskData.client
        })

        const dateLiteral = convertDateLiteral(value)

        return k.raw(dateLiteral).toString()
    }

    renderTemplate(taskData: CommonBuilderTaskType, parameters: ParamType[], value: GenericValueType, column: string) {
        const k = knex({
            client: taskData.client
        })

        if (value === 'all_') {
            value = `null or ${column} is not null`
        }

        return k.raw(this.template.render(`${value}`, parameters).replace(/&#39;/g, "'")).toString()
    }

    static isNumeric(field: Partial<FieldType>) {
        return [
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
    }
}
