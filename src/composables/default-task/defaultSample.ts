import type { SampleTaskType, TaskType } from '@gaio/shared/types'
import { getBucketNameFromAppId } from '@gaio/shared/utils'

export const defaultSample = (base: SampleTaskType & TaskType) => {
	return {
		id: base.id || null,
		type: 'sample',
		appId: base.appId,
		label: base.label || null,
		client: base.client || 'clickhouse',
		repoId: base.repoId || null,
		position: base.position || { x: 63, y: 381.25 },

		calcType: base.calcType || 'percent',
		calcValue: base.calcValue || 0.7,

		tableName: base.tableName || '',
		databaseName: base.databaseName || getBucketNameFromAppId(base.appId),
		resultDatabase: base.resultDatabase || getBucketNameFromAppId(base.appId),
		resultTable: base.resultTable || ''
	}
}
