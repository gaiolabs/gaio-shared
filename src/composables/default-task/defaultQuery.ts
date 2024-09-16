import type { TaskType } from '@gaio/shared/types'

type QueryTaskType = {
	query: string
	sourceType: string
	client: string
	repoId: string
	position: { x: number; y: number }
}
export const defaultQuery = (base: QueryTaskType & TaskType) => {
	return {
		id: base.id,
		type: 'query',
		query: base.query,
		appId: base.appId,
		label: base.label || null,
		client: base.client || 'clickhouse',
		repoId: base.repoId || null,
		temporaryId: 'fasdfas',
		position: base.position || { x: 63, y: 381.25 },
		sourceType: base.sourceType || 'bucket'
	}
}
