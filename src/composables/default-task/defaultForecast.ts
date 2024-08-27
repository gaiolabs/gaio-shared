import type { ForecastTaskType, TaskType } from '@gaio/shared/types'

export const defaultForecast = (base: ForecastTaskType & TaskType) => {
    return {
        appId: base.appId,
        created: !!base.created,
        columnDate: base.columnDate || null,
        columnGrouped: base.columnGrouped || null,
        columnMeasure: base.columnMeasure || null,
        databaseName: base.databaseName || null,
        freq: base.freq || null,
        id: base.id || null,
        periods: base.periods || null,
        posResulTableName: base.posResulTableName || null,
        label: base.label || null,
        client: base.client || 'clickhouse',
        repoId: base.repoId || null,
        shared: false,
        position: base.position || { x: 63, y: 381.25 },
        sourceId: base.sourceId || null,
        resultDatabase: base.resultDatabase || null,
        resultMetricTable: base.resultMetricTable || null,
        resultTable: base.resultTable || null,
        sourceType: base.sourceType || 'bucket',
        tableName: base.tableName || null,
        temporary: !!base.temporary,
        type: 'timeseries'
    }
}
