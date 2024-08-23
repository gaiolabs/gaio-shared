import type { CommonBuilderTaskType } from '@gaio/types'
import type { Context } from 'hono'
import { describeQuery } from './info-helpers/describe.query'
import { DbService } from '../../../db/db.service'

export const tableDescribe = async (c: Context) => {
    const { taskData }: { taskData: CommonBuilderTaskType } = await c.req.json()
    const db = await new DbService().connect(taskData)

    if (taskData.client !== 'clickhouse') {
        throw 'Not implemented'
    }

    const query = describeQuery['clickhouse'](taskData)

    try {
        const res = await db.query(query, [])
        if (res.data && res.data.length > 0) {
            return c.json({
                exists: true,
                ...res.data[0]
            })
        }

        return c.json({
            totalColumns: '',
            modifiedAt: '',
            engine: '',
            totalRows: '',
            totalBytes: '',
            exists: false
        })
    } catch (err) {
        return c.json({
            error: true,
            message: err.message,
            query
        })
    }
}
