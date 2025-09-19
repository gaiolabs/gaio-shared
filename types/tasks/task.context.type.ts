import type { NodeType } from '../core/flow.type'
import { ParamType } from '../core/param.type'
import { GenericType } from '../generic.type'

export type TaskContextType = Partial<{
    userId: string
    userStatus: 'inactive' | 'active'
    userRole: 'user' | 'admin' | 'dev'
    sessionid: string
    appId: string
    flowId: string
    logFrom: string
    params: ParamType[]
    loops: GenericType
    tools: NodeType[]
    taskLogId: string
    context: GenericType
}>
