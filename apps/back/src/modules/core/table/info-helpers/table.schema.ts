export default (databaseData) => {
    let setSQL
    const { client, from, showTemps } = databaseData

    if (client === 'mysql' || client === 'mariadb' || client === 'memsql') {
        const removeTemps = from === 'studio' && !showTemps ? ` and table_name not like 'tmp_gaio%' ` : ''

        setSQL = `SELECT TABLE_SCHEMA as databaseName,
        '${client}' as client,
        'table' as type,
        TABLE_ROWS as tableRows,
        table_name as tableName,
        table_comment as tableComment 
        FROM information_schema.tables
        WHERE TABLE_SCHEMA = "${databaseData.databaseName}" ${removeTemps}
        GROUP BY table_name, table_comment, TABLE_SCHEMA,TABLE_ROWS
        ORDER BY table_name`
    } else if (client === 'pg') {
        setSQL = `SELECT table_catalog AS "databaseName",
        'pg' as client,
        'table' as type,
        '${databaseData.schemaName}' as schemaName,
        table_name AS "tableName" 
        FROM information_schema.tables
        WHERE table_schema = '${databaseData.schemaName}' and table_catalog = '${databaseData.databaseName}'
        GROUP BY table_name, table_schema, table_catalog
        ORDER BY table_name`
    } else if (client === 'redshift') {
        setSQL = `SELECT table_catalog AS "databaseName",
        'redshift' as client,
        'table' as type,
        '${databaseData.schemaName}' as schemaName,
        table_name AS "tableName" 
        FROM information_schema.tables
        WHERE table_schema = '${databaseData.schemaName}' and table_catalog = '${databaseData.databaseName}'
        GROUP BY table_name, table_schema, table_catalog
        ORDER BY table_name`
    } else if (client === 'oracle') {
        setSQL = `SELECT 
                    owner as "databaseName", 
                    'oracle' as "client", 
                    'table' as "type",
                    table_name as "tableName"
                  FROM all_tables 
                  where owner = '${databaseData.databaseName}' 
                  GROUP BY owner, table_name 
                  union 
                  select 
                    owner as "databaseName",
                    'oracle' as "client", 
                    'table' as "type",
                    view_name as "tableName" 
                  from all_views
                  where owner = '${databaseData.databaseName}'
                  GROUP BY owner, view_name`
    } else if (client === 'mssql') {
        setSQL = `USE ${databaseData.databaseName};
        SELECT '${databaseData.databaseName}' as databaseName,
        'mssql' as client,
        'table' as type, 
        TABLE_NAME as tableName,
        table_schema as schemaName
        FROM INFORMATION_SCHEMA.COLUMNS 
        GROUP BY TABLE_NAME, table_schema
        ORDER BY TABLE_NAME`
    } else if (client === 'clickhouse') {
        setSQL = `
        select
  count(system.columns.name) as columns,
  name as tableName,
  database as databaseName,
  total_rows as totalRows,
  total_bytes as totalBytes,
  engine,
  'table' as type,
  'clickhouse' as client
from
  system.tables
  left join system.columns on system.tables.name = system.columns.table
  where database = '${databaseData.databaseName}'
    AND startsWith(name, 'insights_gaio') = 0
    AND startsWith(name, 'tmp_gaio') = 0
    group by name, databaseName, totalRows, totalBytes, engine, type, client
    `

        //         select
        //   name as tableName,
        //   database as databaseName,
        //   total_rows as totalRows,
        //   total_bytes as totalBytes,
        //   engine,
        //   'table' as type,
        //   'clickhouse' as client
        // from
        //   system.tables
        //   where database = '${databaseData.databaseName}'
        //     AND startsWith(name, 'insights_gaio') = 0
        //     AND startsWith(name, 'tmp_gaio') = 0
        //       `;
    } else {
        setSQL = `SELECT TABLE_SCHEMA as databaseName,
        '${client}' as client,
        'table' as type,
        TABLE_ROWS as tableRows,
        table_name as tableName, 
        table_comment as tableComment 
        FROM information_schema.tables 
        WHERE TABLE_SCHEMA = "${databaseData.databaseName}" 
        GROUP BY table_name, table_comment, TABLE_SCHEMA,TABLE_ROWS 
        ORDER BY table_name`
    }
    return setSQL
}
