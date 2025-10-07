import { type CommonTaskType } from './common.task.type'
import { type SchemaType } from '../core/schema.type'

export type DeleteTaskType = Partial<{
	type: 'delete'
	schema: SchemaType
	clearMutation: boolean
}> &
	CommonTaskType
