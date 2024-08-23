import type { FlowType, UserType } from '@gaio/types'
import type { Context } from 'hono'
import { FlowModel } from '../../../models'

export const flowSave = async (c: Context) => {
    const { userId }: UserType = c.get('user')
    const flowData: FlowType = await c.req.json()
    if (flowData.flowId && flowData.appId) {
        if (flowData.flowName) {
            return c.json(FlowModel.mergeFlow(flowData, userId))
        }

        return c.json(FlowModel.saveJustWorkflow(flowData, userId))
    }

    return c.json(FlowModel.createFlow(flowData, userId))
}
