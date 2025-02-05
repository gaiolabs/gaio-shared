type TaskStatus = 'started' | 'ended' | 'error' | 'aborted'

export type TaskJobType = Partial<{
    userId: string
    id: string
    flowId: string
    appId: string
    taskId: string
    taskType: string
    taskTarget: string
    taskSource: string
    taskLabel: string
    status: TaskStatus
    startedAt: string
    endedAt: string
    message: any
}>


export type TaskLogType = {
    taskLogId?: string
    appId?: string
    flowId: string
    userId?: string
    startedAt?: string
    endedAt?: string
    aborted?: boolean
    status?: 'started' | 'ended'
    tasks: Record<string, TaskJobType>
}
