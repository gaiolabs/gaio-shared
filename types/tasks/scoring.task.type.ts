import { type CommonTaskType } from './common.task.type'

export type ScoringTaskType = Partial<{
	modelId: string
	type: 'scoring'
}> &
	CommonTaskType

