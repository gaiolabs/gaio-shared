import { ParamToTableTaskType } from './param-to-table.task.type'

export type TaskContextType = Partial<{
    userId: string
    userStatus: 'inactive' | 'active'
    userRole: 'user' | 'admin' | 'dev'
    sessionid: string
    appId: string
    flowId: string
    logFrom: string
    params: ParamToTableTaskType[]
}>
