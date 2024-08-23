export type TaskContextType = Partial<{
    from: string
    userId: number | string
    userStatus: 'inactive' | 'active'
    userRole: 'user' | 'admin' | 'dev'
    sessionid: string
    appId: string
    flowId: string
}>
