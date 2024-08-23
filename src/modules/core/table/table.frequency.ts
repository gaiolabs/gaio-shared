import type { CommonBuilderTaskType, SchemaFilterType } from '@gaio/types'
import type { Context } from 'hono'
import { max } from 'lodash-es'
import { statsQuery } from './info-helpers/stats.query'
import { DbService } from '../../../db/db.service'
import { tableWhereExtractor } from '../../../utils/tableWhereExtractor'
import { QueryBuilder } from '../builder/builder'

type LocalTaskType = CommonBuilderTaskType & {
    limit?: number
    totalRows?: number
    filters?: string
}

type ConnectionResult = { data: Array<{ percent: number; cumulated: number; qtd: number }> }

export const tableFrequency = async (c: Context) => {
    const {
        taskData,
        filters
    }: {
        taskData: LocalTaskType
        filters: SchemaFilterType[]
    } = await c.req.json()

    const db = await new DbService().connect(taskData)
    const filter: string = await tableWhereExtractor(taskData, filters)

    console.log('taskData', filter)

    let query: string

    taskData.limit = taskData.limit ? taskData.limit : 10

    if (taskData.client === 'clickhouse' && taskData.hasFilters) {
        const sql = await new QueryBuilder().generate(taskData as LocalTaskType, [])

        query = statsQuery.frequency[taskData.client]
            .replace(/@db/g, '')
            .replace(/@schema/g, taskData.schemaName)
            .replace(/@tb/g, `(${sql})`)
            .replace(/@cl/g, taskData.columnName)
            .replace(/@ct/g, String(taskData.totalRows))
            .replace(/@lm/g, String(taskData.limit))
            .replace(/@filter/g, '')
            .replace('.(', '(')
    } else {
        query = statsQuery.frequency[taskData.client]
            .replace(/@db/g, taskData.databaseName)
            .replace(/@schema/g, taskData.schemaName)
            .replace(/@tb/g, taskData.tableName)
            .replace(/@cl/g, taskData.columnName)
            .replace(/@ct/g, String(taskData.totalRows))
            .replace(/@lm/g, String(taskData.limit))
            .replace(/@filter/g, filter)
    }

    try {
        const frequency: ConnectionResult = (await db.query(query, [])) as ConnectionResult

        const toNumber = (value: unknown) => {
            if (value === null || value === undefined) {
                return 0
            }

            if (typeof value === 'number') {
                return value
            }

            if (typeof value === 'string') {
                return Number(value)
            }

            return 0
        }

        frequency.data = frequency.data ? frequency.data : []

        const list = frequency.data.map((o) => toNumber(o.percent || 0))

        const sumCumulative = (index: number) => {
            let total = 0
            for (let i = 0; i <= index; i++) {
                if (isNaN(list[i])) {
                    continue
                }
                total += Number(list[i])
            }
            return total
        }

        frequency.data = frequency.data.map((o, index: number) => {
            o.cumulated = sumCumulative(index)
            o.qtd = toNumber(o.qtd || 0)
            return o
        })

        const maxOccurrence = max(frequency.data.map((o) => Number(o.qtd))) || 0

        return c.json({
            ...frequency,
            maxOccurrence,
            totalRows: taskData.totalRows
        })
    } catch (err) {
        return c.json({
            error: true,
            message: (err as Error).message,
            query
        })
    }
}
