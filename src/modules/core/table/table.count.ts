import type { CommonBuilderTaskType, TaskType } from '@gaio/types'
import type { Context } from 'hono'
import { statsQuery } from './info-helpers/stats.query'
import { DbService } from '../../../db/db.service'
import { QueryBuilder } from '../builder/builder'

export const tableCount = async (c: Context) => {
    const body: { taskData: CommonBuilderTaskType; filters: string } = await c.req.json()
    const { taskData } = body
    let filters = body.filters

    const db = await new DbService().connect(taskData)

    let query = ''
    filters = filters || ''

    const stats = statsQuery

    if (taskData.client === 'clickhouse' && taskData.hasFilters) {
        const sql = await new QueryBuilder().generate(taskData as TaskType, [])

        query = stats.count[taskData.client]
            .replace(/@db/g, '')
            .replace(/@schema/g, taskData.schemaName)
            .replace(/@tb/g, `(${sql})`)
            .replace(/@filter/g, '')
            .replace('.(', '(')
    } else {
        query = stats.count[taskData.client]
            .replace(/@db/g, taskData.databaseName)
            .replace(/@schema/g, taskData.schemaName)
            .replace(/@tb/g, taskData.tableName)
            .replace(/@filter/g, filters)
    }

    if (taskData.countDistinct) {
        query = query.replace(/@cl/g, taskData.columnName)
    } else {
        query = query
            .replace(', count(distinct(@cl)) as countDistinct', '')
            .replace(', count(distinct("@cl")) as "countDistinct"', '')
            .replace(', count(distinct("@cl")) "countDistinct"', '')
    }

    try {
        const res = await db.query(query, [])
        let totalRows = 0
        let totalRowsDistinct = 0

        if (res.data && res.data[0]) {
            totalRows = Number(res.data[0].qtd)
            totalRowsDistinct = res.data[0].countDistinct as number
        } else if (res && res[0]) {
            totalRows = Number(res[0].qtd || 0)
        }

        return c.json({ totalRows, totalRowsDistinct })
    } catch (err) {
        return c.json({
            error: true,
            message: (err as Error).message,
            query
        })
    }
}
