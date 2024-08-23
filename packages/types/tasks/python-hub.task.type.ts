import { type CommonTaskType } from './common.task.type'

export type PythonHubTaskType = Partial<{
    runningFlowId: string
}> &
    CommonTaskType
