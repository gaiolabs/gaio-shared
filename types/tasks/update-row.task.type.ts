import { SchemaType } from '../core/schema.type'
import { type CommonTaskType } from './common.task.type'

export type UpdateRowTaskType = Partial<{
	type: 'update'
	schema: SchemaType
	clearMutation: boolean
}> &
	CommonTaskType

