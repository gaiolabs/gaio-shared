import { type CommonTaskType } from './common.task.type'

export type ClusterTaskType = Partial<{
    excludeColumns: string[]
    estimateK: boolean
    executionTime: number
    clusterSize: number
}> &
    CommonTaskType
