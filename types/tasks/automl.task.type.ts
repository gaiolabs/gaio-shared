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
}>

export type AutoMLTaskType = Partial<{
    type: 'automl';
    settings: AutoMLTaskTypeSettings
    limitRows: number
}> &
    CommonTaskType
