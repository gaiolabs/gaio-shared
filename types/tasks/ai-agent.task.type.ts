import type { GenericType } from '../generic.type'
import type { CommonTaskType } from './common.task.type'

export type AiAgentTaskType = {
	id: string
	label: string
	type: 'aiAgent'
} & CommonTaskType &
	GenericType
// need to remove GenericType, defined here while the task is being build
