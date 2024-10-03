import type { ExportToFileType } from '@gaio/shared/types'

export const defaultExportCsv = (base: ExportToFileType) => {
	return {
		appId: base.appId,
		client: base.client || 'clickhouse',
		compress: !!base.compress,
		databaseName: base.databaseName || null,
		dropTables: base.dropTables || [],
		id: base.id || null,
		label: base.label || null,
		position: base.position || { x: 63, y: 381.25 },
		repoId: base.repoId || null,
		shared: base.shared || false,
		schemaName: base.schemaName || null,
		separator: base.separator || 'CSVWithNames',
		sourceId: base.sourceId || null,
		sourceType: base.sourceType || 'bucket',
		tableName: base.tableName || null,
		temporary: base.temporary || false,
		temporaryId: base.temporaryId || null,
		truncateTables: base.truncateTables || [],
		type: 'export',
	}
}
