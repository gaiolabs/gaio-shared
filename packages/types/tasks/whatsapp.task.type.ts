import { type CommonTaskType } from './common.task.type'
import type { GenericType } from '../generic.type'

export type WhatsappTaskType = Partial<{
    options: GenericType
    sender: string
    templates: GenericType[]
}> &
    CommonTaskType
