import type { ExportToFileType } from '@gaio/types'

export const defaultExportCsv = (base: ExportToFileType) => {
    return {
        appId: base.appId,
        client: base.client || 'clickhouse',
        compress: !!base.compress,
        databaseName: base.resultDatabase || null,
        dropTables: base.dropTables || [],
        id: base.id || null,
        label: base.label || null,
        position: base.position || { x: 63, y: 381.25 },
        repoId: base.repoId || null,
        resultDatabase: base.resultDatabase || null,
        resultTable: base.resultTable || null,
        shared: base.shared || false,
        schemaName: base.schemaName || null,
        separator: base.separator || null,
        sourceId: base.sourceId || null,
        sourceType: base.sourceType || 'bucket',
        tableName: base.resultTable || null,
        temporary: base.temporary || false,
        temporaryId: base.temporaryId || null,
        truncateTables: base.truncateTables || [],
        type: 'export'
    }
}
