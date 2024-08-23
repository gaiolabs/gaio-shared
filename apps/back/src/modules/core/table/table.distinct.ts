import type { CommonBuilderTaskType } from '@gaio/types'
import type { Context } from 'hono'
import { statsQuery } from './info-helpers/stats.query'
import { DbService } from '../../../db/db.service'
import { QueryBuilder } from '../builder/builder'

export const tableDistinct = async (c: Context) => {
    const body: { taskData: CommonBuilderTaskType; filters: string } = await c.req.json()
    const { taskData } = body
    const db = await new DbService().connect(taskData)

    let query = ''

    if (taskData.client === 'clickhouse' && taskData.hasFilters) {
        const sql = await new QueryBuilder().generate(taskData, [])
        query = statsQuery.countDistinct[taskData.client]
            .replace(/@db/g, '')
            .replace(/@schema/g, taskData.schemaName)
            .replace(/@tb/g, `(${sql})`)
            .replace(/@cl/g, taskData.columnName)
            .replace(/@filter/g, '')
            .replace('.(', '(')
    } else {
        query = statsQuery.countDistinct[taskData.client]
            .replace(/@db/g, taskData.databaseName)
            .replace(/@schema/g, taskData.schemaName)
            .replace(/@tb/g, taskData.tableName)
            .replace(/@filter/g, '')
            .replace(/@cl/g, taskData.columnName)
    }

    try {
        const res = await db.query(query, [])
        let totalDistinctRows = 0
        let totalRows = 0

        console.log('fasfa', query)

        if (res.data && res.data[0]) {
            totalDistinctRows = Number(res.data[0].countDistinct || 0)
            totalRows = Number(res.data[0].qtd)
        } else if (res && res[0]) {
            totalDistinctRows = Number(res[0].countDistinct || 0)
            totalRows = Number(res[0].qtd)
        }

        return c.json({ totalDistinctRows, totalRows })
    } catch (err) {
        return c.json({
            error: true,
            message: (err as Error).message,
            query
        })
    }
}
