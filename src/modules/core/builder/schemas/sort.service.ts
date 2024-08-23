import type { CommonBuilderTaskType, FieldType, ParamType, SchemaSortType } from '@gaio/types'
import { type Knex } from 'knex'
import knex from 'knex'
import { TemplateService } from '../../../shared/template.service'

export class SortService {
    private template = new TemplateService()

    public build(taskData: CommonBuilderTaskType, params: ParamType[], builder: Knex) {
        const schema = taskData.schema

        const knexConn = knex({
            client: taskData.client
        })

        if (schema.sort.length <= 0 && taskData.client === 'mssql') {
            schema.sort.push({
                computedId: 'fihEVv',
                columnName: 'just_sort',
                alias: 'just_sort',
                content: '(select null)',
                dataType: 'Nullable(String)',
                type: 'computed',
                id: 'OFAzeX',
                order: 'asc'
            } as SchemaSortType)
        }

        schema.sort.forEach((field) => {
            if (field.type === 'computed' || field.computedId) {
                this.getComputedContent(taskData, params, builder, field, knexConn)
            } else if (field.alias && field.alias !== '' && field.type !== 'value') {
                const orderName = knexConn.raw(field.alias).toString()
                builder.orderBy(orderName, field.order)
            } else if (field.type && field.type !== 'none' && field.type !== 'value') {
                const orderName = knexConn.raw(field.type + '_' + field.columnName).toString()
                builder.orderBy(orderName, field.order)
            } else {
                builder.orderBy(field.tableName + '.' + field.columnName, field.order)
            }
        })

        return builder
    }

    private getComputedContent(
        taskData: CommonBuilderTaskType,
        params: ParamType[],
        builder: Knex,
        field: FieldType,
        knexConn: Knex
    ) {
        const computed = taskData.schema.computed.find((o) => o.computedId === field.computedId)
        if (computed) {
            const orderName = knexConn.raw(`(${this.template.render(computed.content, params)})`).toString()
            builder.orderBy(orderName, field.order)
        }
        return builder
    }
}
