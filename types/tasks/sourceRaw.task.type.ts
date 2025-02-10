import { SchemaType } from '../core/schema.type'
import { type CommonTaskType } from './common.task.type'

export type SourceRawTaskType = Partial<{
	bringData: boolean
	insertMode: boolean
	autoColumns: boolean
	schemaInference: boolean
	fieldAsString: boolean
	jsForceBulk: boolean
	onErrorCreateTable: boolean
	rawImport: boolean
	codeSnippetId: string
	autoFetch: boolean
	maxFetch: number
	schema: SchemaType
	bucketClient: string
	type: 'sourceRaw'
}> &
    CommonTaskType
