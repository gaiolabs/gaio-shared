import { ParamToTableTaskType } from './param-to-table.task.type'

export type TaskContextType = Partial<{
    from: string
    userId: string
    userStatus: 'inactive' | 'active'
    userRole: 'user' | 'admin' | 'dev'
    sessionid: string
    appId: string
    flowId: string
    params: ParamToTableTaskType[]
}>
