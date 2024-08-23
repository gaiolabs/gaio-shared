import type { CommonBuilderTaskType, SchemaFilterType, TaskType } from '@gaio/types'
import type { Context } from 'hono'
import { statsQuery } from './info-helpers/stats.query'
import { DbService } from '../../../db/db.service'
import { tableWhereExtractor } from '../../../utils/tableWhereExtractor'
import { QueryBuilder } from '../builder/builder'

export const tableStats = async (c: Context) => {
    const {
        taskData,
        filters
    }: {
        taskData: CommonBuilderTaskType
        filters: SchemaFilterType[]
    } = await c.req.json()
    const db = await new DbService().connect(taskData)

    const filter: string = await tableWhereExtractor(taskData, filters)
    let query = ''

    if (taskData.client === 'clickhouse' && taskData.hasFilters) {
        const sql = await new QueryBuilder().generate(taskData as TaskType, [])
        query = statsQuery.statistics[taskData.client]
            .replace(/@db/g, '')
            .replace(/@schema/g, taskData.schemaName)
            .replace(/@tb/g, `(${sql})`)
            .replace(/@cl/g, taskData.columnName)
            .replace('.(', '(')
    } else {
        query = statsQuery.statistics[taskData.client]
            .replace(/@db/g, taskData.databaseName)
            .replace(/@schema/g, taskData.schemaName)
            .replace(/@tb/g, taskData.tableName)
            .replace(/@cl/g, taskData.columnName)
            .replace(/@filter/g, filter)
    }

    return c.json(
        db.query(query, []).catch((err: Error) => {
            return {
                error: true,
                message: err.message,
                query
            }
        })
    )
}
