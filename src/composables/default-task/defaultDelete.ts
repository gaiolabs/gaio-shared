import { defaultSchema } from '@/composables/default-task/defaultSchema'
import type { DeleteTaskType, TaskType } from '@gaio/shared/types'
import { getBucketNameFromAppId } from '@gaio/shared/utils'

export const defaultDelete = (base: DeleteTaskType & TaskType) => {
	return {
		id: base.id || null,
		appId: base.appId,
		client: base.client || 'clickhouse',
		databaseName: base.databaseName || getBucketNameFromAppId(base.appId),
		label: base.label || null,
		position: base.position || {
			x: 65,
			y: 65
		},
		repoId: base.repoId,
		sourceId: base.sourceId || null,
		sourceType: base.sourceType || 'bucket',
		tableName: base.tableName,
		temporary: !!base.temporary,

		type: 'delete',
		schema: base.schema || defaultSchema,
		clearMutation: false
	}
}
