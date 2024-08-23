import type { TaskType } from '@gaio/types'
import type { Context } from 'hono'
import tableSchema from './info-helpers/table.schema'
import { DbService } from '../../../db/db.service'

export const tableList = async (c: Context) => {
    const { taskData }: { taskData: TaskType } = await c.req.json()
    const db = await new DbService().connect(taskData)
    const query = await tableSchema(taskData as TaskType)

    return c.json(
        db
            .query(query)
            .then((res) => {
                res.data.map((item) => {
                    item.sourceId = taskData.sourceId
                    item.sourceType = taskData.sourceType || 'bucket'
                    return item
                })
                return res
            })
            .catch((err: Error) => {
                return {
                    error: true,
                    message: err.message,
                    query
                }
            })
    )
}
