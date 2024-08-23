import type { PivotTaskType } from '@gaio/types'
import { getBucketNameFromAppId } from '@gaio/utils'
import { dropTableIfExist, executeQuery } from '../runner.tools'

export default async <T extends PivotTaskType>(taskData: T) => {
    await dropTableIfExist(taskData)
    const pivotQuery = await genPivotTableQuery(taskData)
    await createPivotTable(taskData, pivotQuery)
    return { status: 'done' }
}

const createPivotTable = async (taskData: PivotTaskType, query: string) => {
    const resultTable = getBucketNameFromAppId(taskData.appId) + '.' + taskData.resultTable

    await executeQuery({
        at: taskData,
        sql: `CREATE  TABLE
                ${resultTable}
                ENGINE = MergeTree 
                ORDER BY tuple() as ${query}`
    })
}

const genPivotTableQuery = async (taskData: PivotTaskType) => {
    let query = `SELECT `

    let union = []

    if (taskData.extraFieldsPosition === 'start' && taskData.extraFields.length > 0) {
        union = [...taskData.extraFields]
    }

    ;(taskData.columns || []).forEach((col) => {
        let doCase = `CASE  WHEN ${taskData.transposeColumn}='${col[taskData.transposeColumn]}'
            THEN ${taskData.transposeColumnValue}
            END`
        doCase = `${aggregateIfNeeded(taskData.transposeAggregator, doCase)} AS \`${col.transposeName}\``
        union.push(doCase)
    })

    if (taskData.extraFieldsPosition === 'end' && taskData.extraFields.length > 0) {
        union = [...taskData.extraFields]
    }

    query += ` ${union.toString()} `

    let groupBy = ''

    if (taskData.transposeAggregator && taskData.transposeAggregator !== 'none') {
        if (taskData.extraFields && taskData.extraFields.length > 0) {
            groupBy = ` GROUP BY ${taskData.extraFields.toString()} `
        }
    }

    query += ` FROM ${getBucketNameFromAppId(taskData.appId)}.${taskData.tableName} ${groupBy} `

    return query
}

const aggregateIfNeeded = (aggregator: string, query: string) => {
    if (aggregator !== 'none') {
        if (aggregator === 'count') {
            return `${aggregator}(${query})`
        } else {
            return `${aggregator}(toFloat32(${query}))`
        }
    } else {
        return query
    }
}
