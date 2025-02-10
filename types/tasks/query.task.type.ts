import { type CommonTaskType } from './common.task.type'

export type QueryTaskType = Partial<{
	query: string
	prepare: boolean
	limit: number
	codeSnippetId: string
	type: 'query'
}> &
	CommonTaskType

