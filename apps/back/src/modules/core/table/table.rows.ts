import type { TaskType } from '@gaio/types'
import type { Context } from 'hono'
import { DbService } from '../../../db/db.service'
import { QueryBuilder } from '../builder/builder'

export const tableRows = async (c: Context) => {
    const { taskData }: { taskData: TaskType } = await c.req.json()
    const db = await new DbService().connect(taskData)

    const query = await new QueryBuilder().generate(taskData as TaskType, [])

    return c.json(
        db.query(query.replace(/`/g, ''), []).catch((err: Error) => {
            return {
                error: true,
                message: err.message,
                query
            }
        })
    )
}
