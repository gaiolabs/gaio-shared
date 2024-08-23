import type { InsertTableTaskType } from '@gaio/types'
import { getBucketNameFromAppId } from '@gaio/utils'
import { executeQuery } from '../runner.tools'

export default async <T extends InsertTableTaskType>(taskData: T) => {
    const resultTable = getBucketNameFromAppId(taskData.appId) + '.' + taskData.resultTable
    const sourceTable = getBucketNameFromAppId(taskData.appId) + '.' + taskData.tableName

    const listTarget = []
    const listSource = []

    taskData.schema.select.forEach((o) => {
        if (o.targetColumn !== 'none') {
            listTarget.push(o.targetColumn)
            listSource.push(o.columnName)
        }
    })

    return await executeQuery({
        at: taskData,
        sql: `INSERT INTO ${resultTable} (${listTarget.toString()})
              SELECT ${listSource.toString()}
                FROM ${sourceTable}`
    })
}
