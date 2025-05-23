import {type CommonTaskType} from './common.task.type'

export type ScoringTaskType = Partial<{
    type: 'scoring'
    modelId: string
}> &
    CommonTaskType

