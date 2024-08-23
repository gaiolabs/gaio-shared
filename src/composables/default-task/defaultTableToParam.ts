export const defaultTableToParam = (base) => {
    return {
        id: base.id || null,
        type: 'tableToParam',
        appId: base.appId,
        label: base.label || null,
        client: base.client || 'clickhouse',
        repoId: base.repoId || null,
        shared: !!base.shared,
        created: !!base.created,
        position: base.position || { x: 63, y: 381.25 },
        sourceId: base.sourceId || null,
        tableName: base.tableName || null,
        temporary: !!base.temporary,
        sourceType: base.sourceType || 'bucket',
        databaseName: base.databaseName || null,

        byReference: base.byReference || false,
        saveAsDefault: base.saveAsDefault || false,
        fieldToParamList: base.fieldToParamList || []
    }
}
