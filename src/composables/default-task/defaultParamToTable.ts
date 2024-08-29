import type { ParamToTableTaskType } from '@gaio/shared/types'

export const defaultParamToTable = (base: ParamToTableTaskType) => {
	return {
		id: base.id || null,
		type: 'paramToTable',
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

		resultTable: base.resultTable || null,
		resultDatabase: base.resultDatabase || null,
		params: base.params || null
	}
}
