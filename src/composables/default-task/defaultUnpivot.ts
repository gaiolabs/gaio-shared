import type { TaskType, UnpivotTaskType } from '@gaio/shared/types'

export const defaultUnpivot = (base: UnpivotTaskType & TaskType) => {
    return {
        id: base.id || null,
        type: 'unpivot',
        appId: base.appId,
        label: base.label || null,
        client: base.client || 'clickhouse',
        repoId: base.repoId || null,
        position: base.position || { x: 63, y: 381.25 },
        tableName: base.tableName || '',
        sourceType: base.sourceType || '',
        resultTable: base.resultTable || null,
        databaseName: base.databaseName || '',
        resultDatabase: base.resultDatabase || '',

        extraColumns: base.extraColumns || [],
        extraColumnPosition: base.extraColumnPosition || 'start',
        orderBy: base.orderBy,
        orderByType: base.orderByType || 'asc',
        unpivotColumns: base.unpivotColumns || []
    }
}
