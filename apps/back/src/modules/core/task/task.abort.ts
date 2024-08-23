import type { Context } from 'hono'
import { TaskLogModel } from '../../../models'

export const taskAbort = async (c: Context) => {
    const { id } = await c.req.json()
    return await TaskLogModel.updateTaskLogStopProp(id as string)
}
