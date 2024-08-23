import type { SampleTaskType } from '@gaio/types'
import { dropTableIfExist, executeQuery } from '../runner.tools'

const calculateLimit = (taskData: Partial<SampleTaskType>) => {
    if (taskData.calcType === 'percent') {
        return ` LIMIT CAST(toInt64(round((SELECT count(*) FROM ${taskData.databaseName}.${
            taskData.tableName
        }) * ${Number(taskData.calcValue)}, 0)), 'Int64')`
    }
    return ` LIMIT ${Number(taskData.calcValue)} `
}

const handleError = (error) => {
    const { message, code, errno, query } = Boolean(error.data?.[0]) || error.data || error
    throw { error: true, message, code, errno, query }
}

export default async <T extends SampleTaskType>(taskData: T) => {
    await dropTableIfExist(taskData)
    const limit = calculateLimit(taskData)
    try {
        return await executeQuery({
            at: taskData,
            sql: `
                CREATE TABLE ${taskData.databaseName}.${taskData.resultTable}
                ENGINE = MergeTree
                ORDER BY tuple() as
                SELECT generateUUIDv4() as uuid, *
                FROM ${taskData.databaseName}.${taskData.tableName}
                ORDER BY uuid ASC
                ${limit}`
        })
    } catch (error) {
        handleError(error)
    }
}
