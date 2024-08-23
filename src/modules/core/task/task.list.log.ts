import type { Context } from 'hono'
import { TaskLogModel } from '../../../models'

export const taskListLog = async (c: Context) => {
    const user = c.get('user')
    const { appId } = await c.req.json()
    return c.json(TaskLogModel.getLogsListByAppId(appId, user.userId))
}
