import type { CommonBuilderTaskType } from '@gaio/types'
type ClientType = 'mysql' | 'pg' | 'oracle' | 'mssql' | 'clickhouse' | 'memsql' | 'mariadb'

type SqlTemplatesType = {
    [K in ClientType]: (databaseData: CommonBuilderTaskType) => string
}

const sqlTemplates: SqlTemplatesType = {
    memsql: (databaseData: CommonBuilderTaskType) => `SELECT
        TABLE_SCHEMA as databaseName,
        TABLE_NAME as tableName,
        COLUMN_NAME as columnName,
        COLUMN_TYPE as columnType,
        DATA_TYPE as dataType
    FROM information_schema.columns
    WHERE TABLE_SCHEMA = "${databaseData.databaseName}"
    AND TABLE_NAME =  "${databaseData.tableName}"`,
    mariadb: (databaseData: CommonBuilderTaskType) => `SELECT
        TABLE_SCHEMA as databaseName,
        TABLE_NAME as tableName,
        COLUMN_NAME as columnName,
        COLUMN_TYPE as columnType,
        DATA_TYPE as dataType
    FROM information_schema.columns
    WHERE TABLE_SCHEMA = "${databaseData.databaseName}"
    AND TABLE_NAME =  "${databaseData.tableName}"`,
    mysql: (databaseData: CommonBuilderTaskType) => `SELECT
        TABLE_SCHEMA as databaseName,
        TABLE_NAME as tableName,
        COLUMN_NAME as columnName,
        COLUMN_TYPE as columnType,
        DATA_TYPE as dataType
    FROM information_schema.columns
    WHERE TABLE_SCHEMA = "${databaseData.databaseName}"
    AND TABLE_NAME =  "${databaseData.tableName}"`,
    pg: (databaseData: CommonBuilderTaskType) => `SELECT
        table_catalog AS "databaseName",
        TABLE_NAME AS "tableName",
        COLUMN_NAME AS "columnName",
        data_type as "columnType",
        data_type as "dataType"
    FROM information_schema.columns
    WHERE table_catalog = '${databaseData.databaseName}'
    and table_schema = '${databaseData.schemaName}' AND TABLE_NAME = '${databaseData.tableName}'`,
    oracle: (databaseData: CommonBuilderTaskType) => `SELECT
        col.data_type as "columnType",
        col.owner as "databaseName",
        col.table_name as "tableName",
        col.column_name as "columnName",
        col.data_scale as "columnLength",
        col.data_type as "dataType"
    FROM all_tab_columns col
    left join sys.all_views v on col.owner = v.owner
    and col.table_name = v.view_name
    WHERE (col.owner = '${databaseData.databaseName.trim().toUpperCase()}' OR col.owner = '${databaseData.databaseName
        .trim()
        .toUpperCase()}') AND  col.table_name  = '${databaseData.tableName.trim()}'`,
    mssql: (databaseData: CommonBuilderTaskType) => {
        const filterBySchema = databaseData.schemaName ? ` AND table_schema = '${databaseData.schemaName}';` : ''
        return `USE ${databaseData.databaseName};
        SELECT DATA_TYPE as columnType,
        '${databaseData.databaseName}' as databaseName,
        DATA_TYPE as dataType,
        TABLE_NAME as tableName,
        COLUMN_NAME as columnName,
        table_schema as schemaName
        FROM INFORMATION_SCHEMA.COLUMNS with(nolock)
        WHERE TABLE_NAME = '${databaseData.tableName}'
        ${filterBySchema}`
    },
    clickhouse: (databaseData: CommonBuilderTaskType) => `SELECT
        table as tableName,
        name as columnName,
        toUInt8OrNull(replace(comment, 'columnLength=', '')) as columnLength,
        '${databaseData.databaseName}' as databaseName,
        type as dataType
    FROM system.columns
    where database = '${databaseData.databaseName}'
    and table = '${databaseData.tableName}'`
}

export const fieldSchemaQuery = (databaseData: CommonBuilderTaskType) => {
    const sqlTemplate = databaseData.client ? sqlTemplates[databaseData.client as ClientType] : sqlTemplates.clickhouse
    return sqlTemplate(databaseData)
}
