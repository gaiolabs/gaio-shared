import type { CommonTaskType } from './common.task.type'
import type { PositionType } from '../core/flow.type'

export type ReportPreviewTaskType = Partial<{
    id: string
    label: string
    position: PositionType
    reportType: string
    reportId: string
    type: string
}> &
    CommonTaskType
