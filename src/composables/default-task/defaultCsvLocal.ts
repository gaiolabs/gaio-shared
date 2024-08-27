import type { LocalFileTaskType } from '@gaio/shared/types'

export const defaultCsvLocal = (base: LocalFileTaskType) => {
    return {
        appId: base.appId,
        client: base.client || 'clickhouse',
        columns: base.columns || null,
        databaseName: base.resultDatabase || null,
        deleteAfterImport: base.deleteAfterImport || false,
        dropTables: base.dropTables || [],
        fileFormatType: base.fileFormatType || 'CSVWithNames',
        folderPath: base.folderPath || '',
        id: base.id || null,
        insertMode: base.insertMode,
        label: base.label || null,
        newOracle: base.newOracle || false,
        position: base.position || { x: 63, y: 381.25 },
        repoId: base.repoId || null,
        resultDatabase: base.resultDatabase || null,
        resultTable: base.resultTable || null,
        schemaInference: base.schemaInference || 'noSchemaInference',
        shared: base.shared || false,
        sourceId: base.sourceId || null,
        sourceType: base.sourceType || 'bucket',
        tableName: base.resultTable || null,
        truncateTables: base.truncateTables || [],
        type: 'localCsv'
    }
}
