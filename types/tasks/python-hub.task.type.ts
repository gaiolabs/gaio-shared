import { type CommonTaskType } from './common.task.type'

export type PythonHubTaskType = Partial<{
    type: 'basket' | 'cluster' | 'pca' | 'timeseries'
    runningFlowId: string
}> &
    CommonTaskType
