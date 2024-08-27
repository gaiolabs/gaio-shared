import { defaultSchema } from '@/composables/default-task/defaultSchema'
import { getBucketNameFromAppId } from '@gaio/shared/utils'

export const defaultBuilderTask = (base) => {
    return {
        id: base.id || null,
        type: 'builder',
        appId: base.appId,
        bucketClient: base.bucketClient || null,
        client: base.client || 'clickhouse',
        databaseName: base.databaseName || getBucketNameFromAppId(base.appId),
        insertMode: !!base.insertMode,
        label: base.label || null,
        optimize: !!base.optimize,
        position: base.position || {
            x: 65,
            y: 65
        },
        rawImport: !!base.rawImport,
        repoId: base.repoId,
        resultDatabase: base.resultDatabase || getBucketNameFromAppId(base.appId),
        resultTable: base.resultTable || null,
        schema: base.schema || defaultSchema,
        schemaName: base.schemaName || null,
        sourceId: base.sourceId || null,
        sourceType: base.sourceType || 'bucket',
        tableName: base.tableName,
        tableView: !!base.tableView,
        temporary: !!base.temporary
    }
}
