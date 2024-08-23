import type { TaskType, GoogleSpreadsheetTaskType } from '@gaio/types'

export const defaultGoogleSpreadsheet = (base: GoogleSpreadsheetTaskType & TaskType) => {
    return {
        id: base.id || null,
        type: 'googleSpreadsheet',
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
        insertMode: base.insertMode || false,
        url: base.url || ''
    }
}
