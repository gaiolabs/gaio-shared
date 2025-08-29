import type { CommonTaskType } from './common.task.type'

export type AiAgentTaskTask = {
	id: string
	label: string
	type: 'aiAgent'
} & CommonTaskType
