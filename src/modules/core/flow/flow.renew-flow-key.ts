import type { UserType } from '@gaio/types'
import type { Context } from 'hono'
import { FlowModel } from '../../../models'

export const flowRenewFlowKey = async (flowId: string, appId: string, user: UserType) => {
    return await FlowModel.renewFlowKey(flowId, appId, user.userId)
}
