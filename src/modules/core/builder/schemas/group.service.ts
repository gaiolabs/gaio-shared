import type { CommonBuilderTaskType, FieldType, ParamType } from '@gaio/types'
import knex, { type Knex } from 'knex'
import { TemplateService } from '../../../shared/template.service'

export class GroupService {
    private template = new TemplateService()

    public build(taskData: CommonBuilderTaskType, params: ParamType[], builder: Knex) {
        const schema = taskData.schema

        schema.group.forEach((field) => {
            const groupName = field.columnName
            if (field.type === 'computed' || field.computedId) {
                builder = this.getComputedContent(taskData, params, builder, field)
            } else {
                builder.groupBy(field.tableName + '.' + groupName)
                return
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
            builder.groupBy(knexConn.raw(`(${this.template.render(computed.content, params)})`), field.order)
        }
        return builder
    }
}
