import type { CommonBuilderTaskType } from '@gaio/types'
import { DbService } from '../../../db/db.service'
import { QueryBuilder } from '../builder/builder'
import { Context } from 'hono'

export const tableHistogram = async (c: Context) => {
    const { taskData }: { taskData: CommonBuilderTaskType } = await c.req.json()
    let fromThis = taskData.tableName
    const range = taskData.range

    if (taskData.client === 'clickhouse' && taskData.hasFilters) {
        fromThis = `(` + (await new QueryBuilder().generate(taskData, [])) + ')'
    }

    const bColumnName = [...new Array(taskData.bins)].map((o, i) => `b${i + 1}`)

    const countB = bColumnName.map((o, i) => {
        if (i <= 0) {
            return `count(
                            case
                            when ${taskData.columnName} >= f2.min and  ${taskData.columnName} <  f2.${o}
                                then 1
                            end
                        ) as q${i + 1}`
        }
        return `count(
                            case
                            when ${taskData.columnName} >= f2.b${i} and  ${taskData.columnName} < f2.${o}
                            then 1
                            end
                        ) as q${i + 1}`
    })

    const crossJoinList = bColumnName.map((o, i) => {
        if (i <= 0) {
            return `min(${taskData.columnName}) + (max(${taskData.columnName}) - min(${taskData.columnName})) / ${taskData.bins} as b1`
        } else if (i === taskData.bins - 1) {
            return `max(${taskData.columnName}) as ${o}`
        }
        return `min(${taskData.columnName}) + ${i + 1} * (max(${taskData.columnName}) - min(${
            taskData.columnName
        })) / ${taskData.bins} as ${o}`
    })

    let defineRange = ''

    if (taskData.range && taskData.range.length === 2) {
        defineRange = `where ${taskData.columnName} between ${range[0]} and ${range[1]}`
    }
    const db = await new DbService().connect(taskData)

    const query = `
                    select
                      min,
                      max,
                      binRange,
                      ${bColumnName.join(',')},
                      ${countB.join(',')}
                    from
                      ${fromThis} f1
                      cross join (
                        select
                          1 as key,
                          min(${taskData.columnName}) as min,
                          max(${taskData.columnName}) as max,
                          (max(${taskData.columnName}) - min(${taskData.columnName})) as range,
                          (max(${taskData.columnName}) - min(${taskData.columnName})) / ${taskData.bins} as binRange,
                          ${crossJoinList.join(',')}
                        from
                          ${fromThis}
                            ${defineRange} 
                      ) as f2
                    group by
                      min,
                      max,
                      binRange,
                      ${bColumnName.join(',')}`

    try {
        const result = await db.query(query, []).catch((err: Error) => {
            return {
                error: true,
                message: err.message,
                query
            }
        })

        return c.json({
            ...result
        })
    } catch (error) {
        throw error
    }
}
