import type { CommonTaskType } from './common.task.type'

export type AiAgentTask = {
	id: string
	label: string
	type: 'aiAgent'
} & CommonTaskType
