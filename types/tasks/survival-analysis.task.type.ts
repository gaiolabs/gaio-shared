import { type CommonTaskType } from './common.task.type'

export type SurvivalAnalysisTaskType = Partial<{
    type: 'coxph'
}> & CommonTaskType
