import type { QuickTableTaskType } from '@gaio/types'
import { createTableAtBucket, dropTableIfExist, generateClickhouseColumnTypes, streamToBucket } from '../runner.tools'

export default async <T extends Partial<QuickTableTaskType>>(taskData: T) => {
    if (taskData.dropTable) {
        await dropTableIfExist(taskData)
        taskData.columns = taskData.columns.map((column) => {
            column.columnName = column.columnName.replace(/\s/g, '')
            return column
        })

        const columns = generateClickhouseColumnTypes(taskData)
        await createTableAtBucket(taskData, columns)
    }

    return await streamToBucket({
        at: taskData,
        tableName: taskData.resultTable,
        data: taskData.data
    })
}
