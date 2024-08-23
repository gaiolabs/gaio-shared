import type { FieldType, ParamType, SchemaType, CommonBuilderTaskType } from '@gaio/types'
import knex from 'knex'
import { TemplateService } from '../../../shared/template.service'

export class SelectService {
    private template = new TemplateService()
    private static isSourceTask = false

    private static transform(field: FieldType, columnName: string, client: string) {
        if (SelectService.isSourceTask) {
            SelectService.isSourceTask = false

            switch (client) {
                case 'mssql':
                    return columnName
                default:
                    if (field.alias && field.alias !== '') {
                        columnName = `${columnName} AS ${field.alias}`
                    }
                    return columnName
            }
        } else {
            if (field.alias && field.alias !== '') {
                columnName = `${columnName} AS ${field.alias}`
            }
        }

        return columnName
    }

    build(taskData: CommonBuilderTaskType, params: ParamType[], builder: Knex) {
        if (taskData.sourceImportTask) SelectService.isSourceTask = true

        const self = this
        const schema = taskData.schema
        const client = taskData.client

        schema.select.forEach((field: FieldType) => {
            if (field.type === 'computed' || field.computedId) {
                // computed columns
                builder = self.getComputedContent(taskData, params, builder, field)
            } else if (field.type === 'value' || !field.type || field.type === 'none') {
                // simple select
                builder = SelectService.categories(builder, field, client, taskData.schema, taskData.clickhouse)
            } else {
                // aggregations
                builder = SelectService.aggregations(builder, field, params, client, taskData.clickhouse)
            }
        })

        return builder
    }

    private getComputedContent(taskData: CommonBuilderTaskType, params: ParamType[], builder: Knex, field: FieldType) {
        const knexConn = knex({
            client: taskData.client
        })
        const computed = taskData.schema.computed.find((o) => o.computedId === field.computedId)

        if (computed) {
            let text = `${this.template.render(computed.content, params)} AS ${field.columnName}`

            if (taskData.client === 'mysql') {
                text = `${this.template.render(computed.content, params)} AS \`${field.columnName}\``
            }

            text = text.replace(/'all_'/g, ` null or isNull(null)`).replace(/all_/g, ` null or isNull(null)`)
            builder.select(knexConn.raw(text))
        }

        return builder
    }

    private static aggregations(
        builder: Knex,
        field: FieldType,
        params: ParamType[],
        client: string,
        clickhouse: boolean
    ) {
        const knexConn = knex({
            client
        })
        let aggregateField
        let aggregatorName = field.columnName

        if (field.alias && field.alias !== '') {
            aggregatorName = field.alias
        }

        if (field.formula) {
            aggregateField = field.formula + ' AS ' + aggregatorName
        } else {
            aggregateField = field.tableName + '.' + field.columnName + ' AS ' + aggregatorName
        }

        if (field.type === 'countPercent') {
            builder.select(
                knexConn.raw(
                    `(count(${field.tableName}.${field.columnName}) /
            (select count(${field.tableName}.${field.columnName}) from ${field.tableName})) as ${
                aggregatorName ? aggregatorName : field.columnName
            }`
                )
            )
        } else if (field.type === 'sumPercent') {
            builder.select(
                knexConn.raw(
                    `(sum(${field.tableName}.${field.columnName}) /
                (select sum(${field.tableName}.${field.columnName}) from ${field.tableName})) as ${
                    aggregatorName ? aggregatorName : field.columnName
                }`
                )
            )
        } else if (field.type === 'count') {
            builder.count(aggregateField)
        } else if (field.type === 'avg') {
            builder.avg(aggregateField)
        } else if (field.type === 'sum') {
            builder.sum(aggregateField)
        } else if (field.type === 'max') {
            builder.max(aggregateField)
        } else if (field.type === 'min') {
            builder.min(aggregateField)
        } else if (field.type === 'countDistinct') {
            builder.countDistinct(aggregateField)
        } else if (field.type === 'avgDistinct') {
            builder.avgDistinct(aggregateField)
        } else if (field.type === 'sumDistinct') {
            if (clickhouse) {
                builder.select(
                    knexConn.raw(`sum( distinct ${field.tableName + '.' + field.columnName}) as ${aggregatorName}`)
                )
            } else {
                builder.sumDistinct(aggregateField)
            }
        } else if (field.type === 'anyLast') {
            // builder.select(knexConn.raw('STDDEV_POP(?) ?', [field.columnName, aggregatorName]));
            builder.select(knexConn.raw(`anyLast(${field.tableName}.${field.columnName}) AS ${aggregatorName}`))
        } else if (field.type === 'any') {
            // builder.select(knexConn.raw('STDDEV_POP(?) ?', [field.columnName, aggregatorName]));
            builder.select(knexConn.raw(`any(${field.tableName}.${field.columnName}) AS ${aggregatorName}`))
        } else if (field.type === 'stdDevPop') {
            // builder.select(knexConn.raw('STDDEV_POP(?) ?', [field.columnName, aggregatorName]));
            builder.select(knexConn.raw(`stddevPop(${field.tableName}.${field.columnName}) AS ${aggregatorName}`))
        } else if (field.type === 'stdDevSamp') {
            // builder.select(knexConn.raw('STDDEV_SAMP(?) ?', [field.columnName, aggregatorName]));
            builder.select(knexConn.raw(`stddevSamp(${field.tableName}.${field.columnName}) AS ${aggregatorName}`))
        }
        return builder
    }

    private static useAny(schema: SchemaType, clickhouse: boolean, columnName: string) {
        if (clickhouse) {
            const { select, group } = schema
            const hasAgg = select.some((o) => o.type !== 'value' && o.type !== 'computed')
            const hasGroup = group && group.length > 0 && group.some((o) => (o.alias || o.columnName) !== columnName)
            return hasAgg && hasGroup
        }
        return false
    }

    private static categories(
        builder: Knex,
        field: FieldType,
        client: string,
        schema: SchemaType,
        clickhouse: boolean
    ) {
        let column

        // if (SelectService.useAny(schema, clickhouse, field.columnName)) {
        //     const k = knex({
        //         client
        //     });
        //     switch (field.distinct) {
        //         case true:
        //             return builder.distinct(k.raw(`any(${field.tableName + '.' + field.columnName}) as ${field.alias || field.columnName}`));
        //         default:
        //             return builder.select(k.raw(`any(${field.tableName + '.' + field.columnName}) as ${field.alias || field.columnName}`));
        //     }
        // } else

        if (clickhouse) {
            column = field.tableName + '.' + field.columnName

            if (field.alias && field.alias !== '') {
                column = `${column} AS ${field.alias || field.columnName}`
            }
            const k = knex({
                client
            })
            switch (field.distinct) {
                case true:
                    return builder.distinct(k.raw(`${column}`))
                default:
                    return builder.select(k.raw(`${column}`))
            }
        } else {
            column = field.tableName + '.' + field.columnName
            switch (field.distinct) {
                case true:
                    return builder.distinct(SelectService.transform(field, column, client))
                default:
                    return builder.select(SelectService.transform(field, column, client))
            }
        }
    }
}
