import type { CreateTableTaskType } from '@gaio/types'
import { createTableAtBucket, dropTableIfExist, generateClickhouseColumnTypes } from '../runner.tools'

export default async <T extends CreateTableTaskType>(taskData: T) => {
    if (taskData.dropTable) {
        await dropTableIfExist(taskData)
    }

    await createTableAtBucket(taskData, generateClickhouseColumnTypes(taskData))

    return { status: 'done' }
}
