import { type CommonTaskType } from './common.task.type'

export type QueryTaskType = Partial<{
	type: 'query'
	query: string
	prepare: boolean
	limit: number
	codeSnippetId: string
}> &
	CommonTaskType

