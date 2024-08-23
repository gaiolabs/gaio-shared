import type { FlowType } from '@gaio/types'
import type { Context } from 'hono'
import { FlowModel } from '../../../models'

export const flowDelete = async (c: Context) => {
    const { flowId, appId }: FlowType = await c.req.json()
    return c.json(FlowModel.removeFlow(flowId, appId))
}
