import { type CommonTaskType } from './common.task.type'

export type AutoMLTaskTypeSettings = Partial<{
    seed: number
    maxModels: number
    projectId: string
    splitFrame: number
    projectName: string
    reloadSource: boolean
    removeColumns: Array<string>
    trainingFrame: string
    maxRuntimeSecs: number
    responseColumn: string
    limitRows: number
    metadataTableResults: boolean
    results: {
        confusionMatrix: boolean,
        confusionMatrixMetrics: boolean,
        variableImportance: boolean
        variableImportanceFrequency: boolean
        variableImportanceCover: boolean
        models: boolean
        crossValidation: boolean

    }
}>

export type AutoMLTaskType = Partial<{
    type: 'automl';
    settings: AutoMLTaskTypeSettings
    limitRows: number
}> &
    CommonTaskType
