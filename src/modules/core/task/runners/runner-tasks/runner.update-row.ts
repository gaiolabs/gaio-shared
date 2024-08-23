import type { ParamType, UpdateRowTaskType } from '@gaio/types'
import { QueryBuilder } from '../../../builder/builder'
import { executeQuery, killMutation } from '../runner.tools'

export default async <T extends Partial<UpdateRowTaskType>>(taskData: T, params: ParamType[]) => {
    if (taskData.clearMutation) {
        await killMutation({
            tableName: taskData.tableName,
            databaseName: taskData.databaseName
        })
    }

    await executeQuery({
        at: taskData,
        sql: await new QueryBuilder().generate(taskData, params)
    })

    return { status: 'done' }
}
