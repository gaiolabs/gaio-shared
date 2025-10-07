import type { CommonTaskType } from './common.task.type'

export type DiagramQueryTaskType = {
	label: string
	diagramId: string
	type: 'diagramQuery'
	repoId: string
	appId: string
	id: string
} & CommonTaskType
