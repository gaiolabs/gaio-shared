import type { AssociationRulesTaskType } from '@gaio/types'

export const defaultAssociationRules = (base: AssociationRulesTaskType) => {
    const { appId, client, columnCategory, columnReference, minThreshold, minSupport, databaseName, id } = base

    return {
        appId,
        client: client || 'clickhouse',
        columnCategory: columnCategory || null,
        columnReference: columnReference || null,
        created: !!base.created,
        databaseName: databaseName || null,
        id: id || null,
        label: base.label || null,
        minSupport: minSupport || 0,
        minThreshold: minThreshold || 0,
        repoId: base.repoId || null,
        shared: !!base.shared,
        position: base.position || { x: 63, y: 381.25 },
        resultDatabase: base.resultDatabase || null,
        resultTable: base.resultTable || null,
        sourceId: base.sourceId || null,
        sourceType: base.sourceType || 'bucket',
        tableName: base.tableName || null,
        temporary: !!base.temporary,
        type: 'basket'
    }
}
