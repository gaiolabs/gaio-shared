import type { FlowType, UserType } from '@gaio/types'
import { getId } from '@gaio/utils'
import type { Context } from 'hono'
import { cloneDeep } from 'lodash-es'
import { FlowModel } from '../../../models'

export const flowClone = async (c: Context) => {
    const { userId }: UserType = c.get('user')
    const { flowId, appId }: FlowType = await c.req.json()
    const fromFlowData = await FlowModel.getFlow(flowId, appId)
    const toFlowData = cloneDeep(fromFlowData)
    const newFlowId = getId()

    toFlowData.workflow.nodes = toFlowData.workflow.nodes.map((node) => {
        if (node.type !== 'group') {
            const id = node.id
            node.id = getId(6)

            toFlowData.workflow.edges = toFlowData.workflow.edges.map((edge) => {
                if (edge.source === id) {
                    edge.source = node.id
                }
                if (edge.target === id) {
                    edge.target = node.id
                }
                return c.json(edge)
            })
        }
        return c.json(node)
    })

    toFlowData.workflow = JSON.parse(
        JSON.stringify(toFlowData.workflow)
            .split(`"flowId":${fromFlowData.flowId}`)
            .join(`"flowId":"${newFlowId}"`)
            .split(`"flowId":"${fromFlowData.flowId}"`)
            .join(`"flowId":"${newFlowId}"`)
    )

    toFlowData.flowKey = `${appId}:${getId(32)}`
    toFlowData.flowId = newFlowId

    toFlowData.flowName = `Dup. ${fromFlowData.flowName}`

    return c.json(FlowModel.createFlow(toFlowData, userId))
}
