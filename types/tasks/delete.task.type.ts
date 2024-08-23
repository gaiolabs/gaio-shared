import { type CommonTaskType } from './common.task.type'
import { type SchemaType } from '../core/schema.type'

export type DeleteTaskType = Partial<{
    type: string
    schema: SchemaType
    clearMutation: boolean
}> &
    CommonTaskType
