import type { InsertRowTaskType, ParamType } from '@gaio/types'
import { QueryBuilder } from '../../../builder/builder'
import { executeQuery } from '../runner.tools'

export default async <T extends Partial<InsertRowTaskType>>(taskData: T, params: ParamType[]) => {
    await executeQuery({
        at: taskData,
        sql: await new QueryBuilder().generate(taskData, params)
    })

    return { status: 'done' }
}
