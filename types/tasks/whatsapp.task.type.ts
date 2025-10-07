import { GenericType } from '../generic.type'
import { type CommonTaskType } from './common.task.type'

export type WhatsappTaskType = Partial<{
	type: 'whatsapp'
	options: GenericType
	resultTableTruncate: boolean
	sender: string
	templates: GenericType[]
}> &
	CommonTaskType
