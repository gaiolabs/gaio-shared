import type { ParamType, QueryTaskType } from '@gaio/types'
import templateString from '../../../../../utils/templateString'
import { executeQuery } from '../runner.tools'

export default async <T extends QueryTaskType>(taskData: T, params: ParamType[]) => {
    const finalSpace = templateString(taskData.query, params)
    const finalQuery = finalSpace
        .replace(/';'/g, '_____')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')

    const queryList = `${finalQuery}`.split(';').filter((o) => `${o}`.trim())
    const results = []

    for await (const [, sql] of queryList.entries()) {
        const res = runQuery(
            taskData,
            taskData.prepare,
            `${minify(sql.replace('_____', "';'"), taskData.limit)}`.replace(/^--.*/g, '')
        )
        results.push(res)
    }

    return results
}

const runQuery = async (taskData, prepare, sqlQuery) => {
    try {
        return await executeQuery({
            at: taskData,
            sql: sqlQuery
        })
    } catch (error) {
        if (prepare) {
            return await error
        } else {
            if (error && error.data && error.data[0]) {
                const { message, code } = error.data[0]
                throw { error: true, message, code }
            } else if (error && error.data && error.data.message) {
                const { message, code } = error.data
                throw { error: true, message, code }
            } else {
                const { message, code, errno, query } = error
                throw { error: true, message, code, errno, query }
            }
        }
    }
}

const minify = (text: string, limit: number) => {
    const sql = `${text}`
        .replace(/--.*\n/g, ' ')
        .replace(/\/\*[\s\S]*?\*\//g, ' ')
        .replace(' =', '=')
        .replace('= ', '=')
        .replace('( ', '(')
        .replace(' )', ')')
        .replace('\r', ' ')
        .replace('\n', ' ')
        .replace(/ +/g, ' ')
        .replace(/^ /g, ' ')
        .replace(/\r\n|\r|\n/g, ' ')

    const sqlLower = `${sql}`.toLowerCase().trim()

    const startsWithUpdate = `${sqlLower}`.trim().toLowerCase().startsWith('update ')
    const startsWithAlter = `${sqlLower}`.trim().toLowerCase().startsWith('alter ')
    const startsWithCreate = `${sqlLower}`.trim().toLowerCase().startsWith('create ')
    const startsWithInsert = `${sqlLower}`.trim().toLowerCase().startsWith('insert ')

    const doesMachSelect = /select(.*?)from/i.exec(sqlLower)
    const doesMachAttachSelect = /atach(.*?)select(.*?)from/i.exec(sqlLower)
    const doesMachCreateSelect = /create(.*?)select(.*?)from/i.exec(sqlLower) || /create(.*?)table/i.exec(sqlLower)
    const doesMachInsertSelect = /insert(.*?)select(.*?)from/i.exec(sqlLower) || /insert(.*?)into/i.exec(sqlLower)

    if (
        (doesMachCreateSelect && doesMachCreateSelect.length > 0) ||
        (doesMachAttachSelect && doesMachAttachSelect.length > 0)
    ) {
        return sql
    } else if (doesMachInsertSelect && doesMachInsertSelect.length > 0) {
        return sql
    } else if (
        !startsWithUpdate &&
        !startsWithAlter &&
        !startsWithCreate &&
        !startsWithInsert &&
        doesMachSelect &&
        doesMachSelect.length > 0
    ) {
        if (!sql.toLowerCase().includes(' limit ')) {
            if (limit <= 0) {
                return sql
            } else {
                return ` ${sql} limit ${limit || 1000} `
            }
        } else {
            return sql
        }
    }
    return sql
}
