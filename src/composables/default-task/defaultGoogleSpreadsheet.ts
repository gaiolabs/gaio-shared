import type { TaskType, GoogleSpreadsheetTaskType } from '@gaio/shared/types'
import { getBucketNameFromAppId } from '@gaio/shared/utils'

export const defaultGoogleSpreadsheet = (base: GoogleSpreadsheetTaskType & TaskType) => {
	return {
		id: base.id || null,
		type: 'googleSpreadsheet',
		appId: base.appId,
		label: base.label || null,
		client: base.client || 'clickhouse',
		repoId: base.repoId || null,
		position: base.position || { x: 63, y: 381.25 },
		tableName: null,
		databaseName: null,
		sourceType: base.sourceType || 'bucket',
		resultTable: base.resultTable || null,
		resultDatabase: getBucketNameFromAppId(base.appId),
		insertMode: base.insertMode || false,
		url: base.url || '',
	}
}
