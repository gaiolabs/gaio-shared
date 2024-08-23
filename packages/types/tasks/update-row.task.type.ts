import { type CommonTaskType } from './common.task.type'
import { type SchemaType } from '../core/schema.type'

export type UpdateRowTaskType = Partial<{
    schema: SchemaType
    clearMutation: boolean
}> &
    CommonTaskType
