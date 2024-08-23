import type { DeleteTaskType } from '@gaio/types'
import { QueryBuilder } from '../../../builder/builder'
import { executeQuery, killMutation } from '../runner.tools'

export default async <T extends DeleteTaskType>(taskData: T) => {
    await killMutation({
        tableName: taskData.tableName,
        databaseName: taskData.databaseName
    })

    await executeQuery({
        at: taskData,
        sql: await new QueryBuilder().generate(taskData, [])
    })

    return { status: 'done' }
}
