import { type CommonTaskType } from './common.task.type'

export type SourceRawTaskType = Partial<{
	bringData: boolean
	insertMode: boolean
	autoColumns: boolean
	schemaInference: boolean
	fieldAsString: boolean
	jsForceBulk: boolean
}> &
    CommonTaskType
