import type { CommonTaskType } from './common.task.type'

export type AiAgentTaskType = {
	type: 'aiAgent'
} & CommonTaskType

// need to remove GenericType, defined here while the task is being build
