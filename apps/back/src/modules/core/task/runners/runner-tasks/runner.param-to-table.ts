import type { ParamToTableTaskType, ParamType } from '@gaio/types'
import { dropTableIfExist, executeQuery } from '../runner.tools'

export default async <T extends ParamToTableTaskType>(taskData: T, params: ParamType[]) => {
    await dropTableIfExist(taskData)
    const query = paramToTableQuery(taskData, params)
    return await soCreateTableAtBucket(taskData, query)
}

const soCreateTableAtBucket = async (taskData: ParamToTableTaskType, query: string) => {
    return await executeQuery({
        at: taskData,
        sql: `CREATE TABLE
                    ${taskData.resultDatabase}.${taskData.resultTable}
                    engine = MergeTree order by tuple() as
                    ${query}`
    })
}

const customParam = (paramValue: string) => {
    if (paramValue && `${paramValue}`.trim().startsWith('{{')) {
        return `(${paramValue.replace(/\{\{|}}/gi, '')})`
    } else if (isNumber(paramValue)) {
        return `'${paramValue}'`
    } else {
        if (paramValue === 'undefined' || paramValue === 'null' || !paramValue) {
            return `''`
        } else {
            return `'${paramValue || ''}'`
        }
    }
}

const paramToTableQuery = (taskData: ParamToTableTaskType, params: ParamType[]) => {
    let sql = 'select '
    params.forEach((par) => {
        if (taskData.params.includes(par.paramName)) {
            sql += `${customParam(par.paramValue)} as ${par.paramName},`
        }
    })
    sql += ';'
    sql = sql.replace(',;', '')
    return sql
}

const isNumber = (n) => {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n)
}
