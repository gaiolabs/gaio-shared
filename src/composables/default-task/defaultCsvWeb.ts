import type { CsvUrlTaskType } from '@gaio/shared/types'

export const defaultCsvWeb = (base: CsvUrlTaskType) => {
	return {
		id: base.id || null,
		type: 'csvUrl',
		appId: base.appId,
		label: base.label || null,
		client: base.client || 'clickhouse',
		repoId: base.repoId || null,
		position: base.position || { x: 63, y: 381.25 },
		sourceId: base.sourceId || null,
		sourceType: base.sourceType || 'bucket',

		tableName: base.resultTable || null,
		databaseName: base.resultDatabase || null,

		resultTable: base.resultTable || null,
		resultDatabase: base.resultDatabase || null,

		url: base.url || '',
		fileFormatType: base.fileFormatType || 'CSVWithNames',
		insertMode: base.insertMode,
		schemaInference: base.schemaInference || 'noSchemaInference'
	}
}
