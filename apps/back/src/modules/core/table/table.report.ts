import type { BuilderTaskType, FieldType, TaskType, SchemaSortType } from '@gaio/types'
import type { Context } from 'hono'
import { DbService } from '../../../db/db.service'
import { QueryBuilder } from '../builder/builder'

const groupRules = (o: FieldType) => {
    return (!o.type || o.type === 'value' || o.type === 'none') && o.type !== 'measure'
}

export const tableReport = async (c: Context) => {
    const { taskData }: { taskData: BuilderTaskType } = await c.req.json()
    const db = await new DbService().connect(taskData)

    if (taskData.schema) {
        const hasAggregation = taskData.schema.select.some((o) => !['none', 'value'].includes(o.type))

        if (hasAggregation) {
            taskData.schema.group = taskData.schema.select.filter(groupRules)
        }

        taskData.schema.sort = taskData.schema.sort || []
        taskData.schema.select.forEach((col) => {
            if (col.order && col.order !== 'none') {
                taskData.schema.sort.push(col as SchemaSortType)
            }
        })

        const query = await new QueryBuilder().generate(taskData as TaskType, [])

        console.log('queryyyyyy', query)

        return c.json(
            db.query(query.replace(/`/g, '')).catch((err: Error) => {
                return {
                    error: true,
                    message: err.message,
                    query
                }
            })
        )
    }

    return c.json({
        status: 'not a report'
    })
}
