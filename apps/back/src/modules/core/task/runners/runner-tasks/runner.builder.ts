import type { BuilderTaskType, ParamType } from '@gaio/types'
import { QueryBuilder } from '../../../builder/builder'

import {
    bucketConnection,
    createTableAsSelectAtBucket,
    createTableAtBucket,
    dropOrTruncateUsedSource,
    dropTableIfExist,
    generateClickhouseColumnTypes,
    insertAsSelect
} from '../runner.tools'

const optimizeTable = async (taskData: BuilderTaskType) => {
    if (taskData.optimize) {
        await (await bucketConnection(taskData)).query(`OPTIMIZE TABLE ${taskData.resultTable} FINAL`, [])
    }
}

export default async <T extends BuilderTaskType>(taskData: T, params: ParamType[]) => {
    if (!taskData.insertMode) {
        await dropTableIfExist(taskData)
    }

    const columns = generateClickhouseColumnTypes(taskData)

    const query = await new QueryBuilder().generate(taskData as BuilderTaskType, params)

    if (taskData.insertMode) {
        await createTableAtBucket(taskData, columns)
        await insertAsSelect(taskData, columns.fields, query)
        await optimizeTable(taskData)
    } else {
        await createTableAsSelectAtBucket(taskData, columns, query)
        await optimizeTable(taskData)
    }

    await dropOrTruncateUsedSource(taskData)

    return { success: true }
}
