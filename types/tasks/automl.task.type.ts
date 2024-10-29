import { type CommonTaskType } from './common.task.type'

export type AutoMLTaskTypeSettings = {
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
}

export type AutoMLTaskType = Partial<{
    settings: AutoMLTaskTypeSettings
    limitRows: number
}> &
    CommonTaskType
