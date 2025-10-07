import type { CommonTaskType } from './common.task.type'

type Aggregator =
	| 'sum'
	| 'count'
	| 'avg'
	| 'min'
	| 'max'
	| 'median'
	| 'mode'
	| 'range'
	| 'variance'
	| 'stdDev'
	| 'first'
	| 'last'
	| 'distinct'

type Column = {
	columnLength: string
	columnName: string
	dataType: string
	databaseName: string
	tableName: string
	type: string
	addedTimestamp?: string
}

type AggregatedColumn = Column & {
	aggregator?: Aggregator
}

export type CrosstableTaskType = Partial<{
	type: 'crosstable'
	description: string
	columns: Column[]
	rows: Column[]
	values: AggregatedColumn[]
}> &
	CommonTaskType
