import { type CommonTaskType } from './common.task.type'

export type UnpivotTaskType = Partial<{
	type: 'unpivot'
	databaseName: string
	tableName: string
	resultDatabase: string
	resultTable: string
	extraColumns?: string[]
	extraColumnPosition?: 'start' | 'end'
	orderBy?: string
	orderByType?: 'ASC' | 'DESC'
	unpivotColumns: string[]
}> &
	CommonTaskType

