import type { CommonBuilderTaskType } from '@gaio/types'

export const describeQuery = {
    clickhouse: (taskData: CommonBuilderTaskType) => `SELECT 
                                        (SELECT count(name) 
                                            FROM system.columns
                                            WHERE table = '${taskData.tableName}' 
                                            AND database = '${taskData.databaseName}'
                                        ) totalColumns,
                                        metadata_modification_time as modifiedAt, 
                                        engine,
                                        total_rows as totalRows,
                                        total_bytes as totalBytes
                                    FROM system.tables 
                                    WHERE name = '${taskData.tableName}' 
                                    AND database = '${taskData.databaseName}'`
}
