import type { ConnectionResultType, GenericType, TaskType } from '@gaio/types'
import { DbService } from '../../../db/db.service'
import tableSchema from '../table/info-helpers/table.schema'

export const commandLoadTables = async ({
    searchTerm,
    appInfo
}: {
    searchItems: string[]
    searchTerm: string
    appInfo: GenericType
}) => {
    const taskData = {
        ...appInfo,
        sourceType: 'bucket'
    }

    const db = await new DbService().connect(taskData)
    const query = await tableSchema(taskData as TaskType)
    let filter = ''

    if (searchTerm) {
        filter = `
                    WHERE replaceRegexpAll(normalizeUTF8NFKD(LOWER(tableName)), '\\pM', '')
	                    LIKE replaceRegexpAll(normalizeUTF8NFKD(LOWER('%${searchTerm}%')), '\\pM', '')
	        `
    }
    const sql = `SELECT * FROM (${query}) ${filter}
	                ORDER BY tableName ASC
	                LIMIT 20 SETTINGS use_query_cache = true`

    const result = (await db
        .query(sql)
        .then((res) => {
            res.data.forEach((item) => {
                item.sourceType = 'bucket'
                return item
            })
            return res
        })
        .catch((err: Error) => {
            return {
                error: true,
                message: err.message,
                query
            }
        })) as ConnectionResultType

    return result.data.map((item) => {
        return {
            label: item.tableName,
            icon: 'table',
            type: 'table',
            data: item
        }
    })
}
