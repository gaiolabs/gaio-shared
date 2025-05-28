import {type CommonTaskType} from './common.task.type'

export type ScoringTaskType = Partial<{
    type: 'scoring'
    limitRows: number,
    modelId: string
}> &
    CommonTaskType

