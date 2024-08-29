import type { QuickTableTaskType } from '@gaio/shared/types'

export const defaultQuickTable = (base: QuickTableTaskType) => {
	return {
		id: base.id || null,
		appId: base.appId,
		label: base.label || null,
		client: base.client || 'clickhouse',
		created: !!base.created,
		databaseName: base.databaseName || null,
		position: base.position || { x: 63, y: 381.25 },
		repoId: base.repoId || null,
		resultTable: base.resultTable || null,
		shared: !!base.shared,
		sourceId: base.sourceId || null,
		sourceType: base.sourceType || 'bucket',
		tableName: base.tableName || null,
		temporary: !!base.temporary,
		type: 'quickTable'
	}
}
