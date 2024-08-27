import type { RestTaskType, TaskType } from '@gaio/shared/types'
import { definedOrDefault, getBucketNameFromAppId } from '@gaio/shared/utils'

export const defaultRest = (base: RestTaskType & TaskType) => {
    return {
        id: base.id || null,
        type: 'rest',
        appId: base.appId,
        label: base.label || null,
        client: base.client || 'clickhouse',
        repoId: base.repoId || null,
        position: base.position || { x: 63, y: 381.25 },

        tableName: base.tableName || '',
        databaseName: base.databaseName || getBucketNameFromAppId(base.appId),
        resultDatabase: base.resultDatabase || getBucketNameFromAppId(base.appId),
        resultTable: base.resultTable || '',

        // rest related
        url: definedOrDefault(base.url, ''),
        method: definedOrDefault(base.method, 'GET'),
        timeout: definedOrDefault(base.timeout, 60),
        headers: definedOrDefault(base.headers, []),
        basicUsername: definedOrDefault(base.basicUsername, ''),
        basicPassword: definedOrDefault(base.basicPassword, ''),
        body: definedOrDefault(base.body, ''),
        restType: definedOrDefault(base.restType, 'json'),
        keepLogTable: definedOrDefault(base.keepLogTable, ''),
        keepLogDays: definedOrDefault(base.keepLogDays, 7),
        dontFixBadData: definedOrDefault(base.dontFixBadData, false),
        resultTableProp: definedOrDefault(base.resultTableProp, ''),
        resultDataTypeProp: definedOrDefault(base.resultDataTypeProp, ''),
        keepLogTableExtraColumn: definedOrDefault(base.keepLogTableExtraColumn, []),
        transferSourceData: definedOrDefault(base.transferSourceData, []),
        resultTableFields: definedOrDefault(base.resultTableFields, []),
        createTableType: definedOrDefault(base.createTableType, 'create')
    }
}
