import type { CommonTaskType } from './common.task.type'
import type { PositionType } from '../core/flow.type'
import { ReportTypeKeys } from './report.keys.type'

export type ReportPreviewTaskType = Partial<{
	id: string
	label: string
	position: PositionType
	reportType: ReportTypeKeys
	reportId: string
	type: 'reportPreview'
}> &
	CommonTaskType
