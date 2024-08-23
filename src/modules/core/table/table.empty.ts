import type { CommonBuilderTaskType } from '@gaio/types'
import type { Context } from 'hono'
import { statsQuery } from './info-helpers/stats.query'
import { DbService } from '../../../db/db.service'
import { QueryBuilder } from '../builder/builder'

export const tableEmpty = async (c: Context) => {
    const body: { taskData: CommonBuilderTaskType; filters: string } = await c.req.json()
    const { taskData } = body
    const db = await new DbService().connect(taskData)

    let query = ''
    const stats = statsQuery

    if (taskData.client === 'clickhouse' && taskData.hasFilters) {
        const sql = await new QueryBuilder().generate(taskData, [])
        query = stats.withoutValues[taskData.client]
            .replace(/@db/g, '')
            .replace(/@schema/g, taskData.schemaName)
            .replace(/@tb/g, `(${sql})`)
            .replace(/@cl/g, taskData.columnName)
            .replace('.(', '(')
    } else {
        query = stats.withoutValues[taskData.client]
            .replace(/@db/g, taskData.databaseName)
            .replace(/@schema/g, taskData.schemaName)
            .replace(/@tb/g, taskData.tableName)
            .replace(/@cl/g, taskData.columnName)
    }

    try {
        const res = await db.query(query, [])
        let totalEmptyRows = 0

        if (res.data && res.data[0]) {
            totalEmptyRows = Number(res.data[0].empty || 0)
        } else if (res && res[0]) {
            totalEmptyRows = Number(res[0].empty || 0)
        }

        return c.json({ totalEmptyRows })
    } catch (err) {
        return c.json({
            error: true,
            message: (err as Error).message,
            query
        })
    }
}
