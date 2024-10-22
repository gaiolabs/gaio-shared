import { type CommonTaskType } from './common.task.type'

export type AutoMLTaskType = Partial<{
    settings: {
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
}> &
    CommonTaskType
