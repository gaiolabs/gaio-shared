import type { UnpivotTaskType } from '@gaio/types'
import { dropTableIfExist, executeQuery } from '../runner.tools'

export default async <T extends UnpivotTaskType>(taskData: T) => {
    await dropTableIfExist(taskData)

    const baseFields = ['category', 'quantity']
    const extraFields = taskData.extraColumns?.length ? taskData.extraColumns : []
    const fields = [...extraFields, ...baseFields].join(',')

    const order = taskData.orderBy ? `ORDER BY ${taskData.orderBy} ${taskData.orderByType}` : ''

    const unpivotColumns = taskData.unpivotColumns
    const sql = `
        SELECT ${fields}
        FROM ${taskData.databaseName}.${taskData.tableName}
        ARRAY JOIN [${unpivotColumns}] AS quantity, [${unpivotColumns.map((o) => `'${o}'`)}] AS category
        ${order}
    `

    return await executeQuery({
        at: taskData,
        sql: `CREATE TABLE ${taskData.resultDatabase}.${taskData.resultTable}
            ENGINE=MergeTree ORDER BY tuple() AS ${sql}`
    })
}
