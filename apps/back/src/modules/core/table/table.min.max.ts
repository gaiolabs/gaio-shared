import type { CommonBuilderTaskType } from '@gaio/types'
import type { Context } from 'hono'
import { statsQuery } from './info-helpers/stats.query'
import { DbService } from '../../../db/db.service'
import { QueryBuilder } from '../builder/builder'

export const tableMinMax = async (c: Context) => {
    const body: { taskData: CommonBuilderTaskType; filters: string } = await c.req.json()
    const { taskData } = body

    const db = await new DbService().connect(taskData)

    let query = ''

    if (taskData.client === 'clickhouse' && taskData.hasFilters) {
        const sql = await new QueryBuilder().generate(taskData, [])
        query = statsQuery.minMax[taskData.client]
            .replace(/@db/g, '')
            .replace(/@schema/g, taskData.schemaName)
            .replace(/@tb/g, `(${sql})`)
            .replace(/@cl/g, taskData.columnName)
            .replace(/@filter/g, '')
            .replace('.(', '(')
    } else {
        query = statsQuery.minMax[taskData.client]
            .replace(/@db/g, taskData.databaseName)
            .replace(/@schema/g, taskData.schemaName)
            .replace(/@tb/g, taskData.tableName)
            .replace(/@filter/g, '')
            .replace(/@cl/g, taskData.columnName)
    }

    try {
        const res = await db.query(query, [])
        let max
        let min
        let median

        if (res.data && res.data[0]) {
            min = res.data[0].minimum
            max = res.data[0].maximum
            median = res.data[0].median
        } else if (res && res[0]) {
            min = res[0].minimum
            max = res[0].maximum
            median = res[0].median
        }

        return c.json({ min, max, median })
    } catch (err) {
        return c.json({
            error: true,
            message: (err as Error).message,
            query
        })
    }
}
