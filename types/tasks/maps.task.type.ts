import type { CommonTaskType } from './common.task.type'

export type MapsTaskType = Partial<{
    type: 'maps'
    reportType: 'maps'
}> &
    CommonTaskType
