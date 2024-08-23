import type { MetaType, TaskType } from '@gaio/types'

export const defaultMeta = (base: MetaType & TaskType) => {
    return {
        id: base.id || null,
        metaId: base.metaId || null,
        type: base.type || 'power',
        appId: base.appId,
        label: base.label || null,
        client: base.client || 'clickhouse',
        repoId: base.repoId || null,
        position: base.position || { x: 63, y: 381.25 },
        sourceType: 'bucket',
        fields: base.fields || [],
        options: base.options || [],
        status: base.status || 'active',
        hits: base.hits || 0,
        userFilter: base.userFilter || null,
        tableName: base.tableName || null,
        databaseName: base.databaseName || null
    }
}
