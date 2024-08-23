import type { FlowType, UserType } from '@gaio/types'
import type { Context } from 'hono'
import { FlowModel } from '../../../models'

export const flowUpdateOrder = async (c: Context) => {
    const { userId }: UserType = c.get('user')
    const { appId }: FlowType = await c.req.json()
    const flowList: string[] = await c.req.json()
    for await (const flowId of flowList) {
        FlowModel.updateFlowOrder(flowList.indexOf(flowId), flowId, appId, userId)
    }
}
