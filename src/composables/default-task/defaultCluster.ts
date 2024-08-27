import type { ClusterTaskType, TaskType } from '@gaio/shared/types'
import { getBucketNameFromAppId } from '@gaio/shared/utils'

export const defaultCluster = (base: ClusterTaskType & TaskType) => {
    return {
        id: base.id,
        type: 'cluster',
        appId: base.appId,
        label: base.label || null,
        client: base.client || 'clickhouse',
        repoId: base.repoId || null,
        position: base.position || { x: 63, y: 381.25 },

        tableName: base.tableName || '',
        databaseName: base.databaseName || getBucketNameFromAppId(base.appId),
        resultDatabase: base.resultDatabase || getBucketNameFromAppId(base.appId),
        resultTable: base.resultTable || '',

        excludeColumns: base.excludeColumns || [],
        estimateK: base.estimateK || false,
        executionTime: base.executionTime || 30,
        clusterSize: base.clusterSize || 3
    }
}
