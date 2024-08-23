import { getBucketNameFromAppId } from '@gaio/utils'

export const defaultTable = (base) => {
    console.log({
        id: base.id || null,
        type: 'table',
        appId: base.appId,
        label: base.tableName || null,
        client: base.client || 'clickhouse',
        repoId: base.repoId || null,
        shared: !!base.shared,
        created: !!base.created,
        position: base.position || { x: 63, y: 381.25 },
        sourceId: base.sourceId || null,
        tableView: !!base.tableView,
        temporary: !!base.temporary,
        sourceType: base.sourceType || 'bucket',
        databaseName: base.databaseName || getBucketNameFromAppId(base.appId) || null,
        tableName: base.tableName || null
    })
    return {
        id: base.id || null,
        type: 'table',
        appId: base.appId,
        label: base.tableName || null,
        client: base.client || 'clickhouse',
        repoId: base.repoId || null,
        shared: !!base.shared,
        created: !!base.created,
        position: base.position || { x: 63, y: 381.25 },
        sourceId: base.sourceId || null,
        tableView: !!base.tableView,
        temporary: !!base.temporary,
        sourceType: base.sourceType || 'bucket',
        databaseName: base.databaseName || getBucketNameFromAppId(base.appId) || null,
        tableName: base.tableName || null
    }
}
