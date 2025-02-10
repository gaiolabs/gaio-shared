import { type CommonTaskType } from './common.task.type'

export type SurvivalAnalysisTaskType = Partial<{
    type: 'survivalAnalysis'
}> & CommonTaskType
