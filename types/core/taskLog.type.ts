export type TaskJobType = Partial<{
    userId: string
    id: string
    flowId: string
    appId: string
    taskId: string
    status: 'started' | 'ended' | 'error'
    startedAt: string
    endedAt: string
    message: any
}>

export type TaskLogType = {
    taskLogId: string
    status: 'started' | 'ended' | 'error'
    aborted: boolean
    startedAt: string
    endedAt: string
    flowId: string
    appId: string
    userId: string
    tasks: Record<string, TaskJobType>
}
