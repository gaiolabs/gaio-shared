import type { FlowType } from '@gaio/types'
import type { Context } from 'hono'
import { FlowModel } from '../../../models'

export const flowList = async (c: Context) => {
    const { appId }: FlowType = await c.req.json()
    return c.json(FlowModel.getSomeDetailFromFlowByAppId(appId))
}
