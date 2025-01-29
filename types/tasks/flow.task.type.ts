import { type CommonTaskType } from './common.task.type'

export type FlowTaskType = Partial<{
    type: 'flow'
    flowId: string
    loopSize: number
}> &
    CommonTaskType
