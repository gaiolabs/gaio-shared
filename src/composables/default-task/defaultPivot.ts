import type { TaskType } from '@gaio/shared/types'
import type { PivotTaskType } from '@gaio/shared/types/tasks/pivot.task.type'

export const defaultPivot = (base: PivotTaskType & TaskType) => {
	return {
		id: base.id || null,
		type: 'pivot',
		appId: base.appId,
		label: base.label || null,
		client: base.client || 'clickhouse',
		repoId: base.repoId || null,
		position: base.position || { x: 63, y: 381.25 },
		columns: base.columns || [],
		tableName: base.tableName || '',
		sourceType: base.sourceType || '',
		extraFields: base.extraFields || [],
		resultTable: base.resultTable || null,
		databaseName: base.databaseName || '',
		resultDatabase: base.resultDatabase || '',
		transposeColumn: base.transposeColumn || '',
		dynamicTranspose: base.dynamicTranspose || false,
		extraFieldsPosition: base.extraFieldsPosition || '',
		transposeAggregator: base.transposeAggregator || '',
		transposeColumnValue: base.transposeColumnValue || '',
		dynamicTransposeSnakeCase: base.dynamicTransposeSnakeCase || false,
		order: base.order || ''
	}
}
