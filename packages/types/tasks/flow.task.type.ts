import { type CommonTaskType } from './common.task.type'

export type FlowTaskType = Partial<{
    flowId: string
    loopSize: number
}> &
    CommonTaskType
