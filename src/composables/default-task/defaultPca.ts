import type { PcaTaskType, TaskType } from '@gaio/shared/types'

export const defaultPca = (base: PcaTaskType & TaskType) => {
	return {
		id: base.id || null,
		type: 'pca',
		appId: base.appId,
		label: base.label || null,
		client: base.client || 'clickhouse',
		repoId: base.repoId || null,
		shared: !!base.shared,
		created: !!base.created,
		position: base.position || { x: 63, y: 381.25 },
		sourceId: base.sourceId || null,
		temporary: !!base.temporary,
		sourceType: base.sourceType || 'bucket',

		tableName: base.tableName || null,
		databaseName: base.databaseName || null,

		resultTable: base.resultTable || null,
		resultDatabase: base.resultDatabase || null,

		excludeColumns: base.excludeColumns || [],
		k: base.k || 2
	}
}
