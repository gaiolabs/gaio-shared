import type { TaskType, UserTaskType } from '@gaio/shared/types'
import { getBucketNameFromAppId } from '@gaio/shared/utils'

export const defaultUserMirror = (base: UserTaskType & TaskType) => {
	return {
		id: base.id || null,
		type: 'userMirror',
		appId: base.appId,
		label: base.label || null,
		client: base.client || 'clickhouse',
		repoId: base.repoId || null,
		position: base.position || { x: 63, y: 381.25 },
		sourceType: base.sourceType || '',

		tableName: base.resultTable || null,
		databaseName: getBucketNameFromAppId(base.appId) || null,

		resultTable: base.resultTable || null,
		resultDatabase: getBucketNameFromAppId(base.appId) || null,
		fields: base.fields || [],
		userType: 'userAll'
	}
}
