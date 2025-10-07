import { type CommonTaskType } from './common.task.type'

export type ExportToFileType = Partial<{
	type: 'exportToFile'
	separator: string
	compress: boolean
}> &
	CommonTaskType
