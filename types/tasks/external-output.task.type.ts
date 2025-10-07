import { type CommonTaskType } from './common.task.type'

export type ExternalOutputTaskType = Partial<{
	dropTable: boolean
	filePath: string
	operation: string
	separator: string
	excludeFields: string
	type: 'externalOutput'
}> &
	CommonTaskType
