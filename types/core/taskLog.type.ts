type TaskStatus = 'started' | 'ended' | 'error' | 'aborted'

export type TaskJobType = Partial<{
    userId: string
    id: string
    flowId: string
    appId: string
    taskId: string
    status: TaskStatus
    startedAt: string
    endedAt: string
    message: any
}>

export type TaskLogType = {
    taskLogId: string
    status: TaskStatus
    aborted: boolean
    startedAt: string
    endedAt: string
    flowId: string
    appId: string
    userId: string
    tasks: Record<string, TaskJobType>
}
