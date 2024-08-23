import type { GenericType, ParamType, TableToParamTaskType } from '@gaio/types'
import { isArray, unionBy } from 'lodash-es'
import { dbGaio } from '../../../../../db/db.gaio'
import { executeQuery } from '../runner.tools'

export default async <T extends TableToParamTaskType>(taskData: T, params: ParamType[]) => {
    const rowValues = await getValuesAtTable(taskData)
    const paramsFromTable = await tableToParam(taskData, params, rowValues[0])

    return { status: 'done', params: paramsFromTable }
}

const getValuesAtTable = async (taskData: TableToParamTaskType) => {
    return executeQuery({
        at: taskData,
        sql: `SELECT * FROM 
                ${taskData.databaseName}.${taskData.tableName}
                LIMIT 1`
    }).then((res) => res['data'] || [])
}

const tableToParam = async (taskData: TableToParamTaskType, params: ParamType[], rowValues: GenericType[]) => {
    const saveOnlyThisParams = []

    for (const key in rowValues) {
        if (taskData.byReference) {
            if (rowValues.hasOwnProperty(key)) {
                const findColumn = taskData.fieldToParamList.find((fieldToParam) => fieldToParam.columnName === key)

                if (findColumn && findColumn.paramName) {
                    params.forEach((param) => {
                        if (findColumn.paramName === param.paramName) {
                            param.paramValue = rowValues[key] as unknown as string
                            saveOnlyThisParams.push(param)
                        }
                    })
                }
            }
        } else {
            if (rowValues.hasOwnProperty(key)) {
                const newVal = rowValues[key] as unknown as string
                for (const param of params) {
                    if (param.paramName === key) {
                        param.paramValue = newVal
                        saveOnlyThisParams.push(param)
                    }
                }
            }
        }
    }

    if (taskData.saveAsDefault) {
        await updateDefaultParam(taskData, saveOnlyThisParams)
    }

    return params
}

const updateDefaultParam = async (taskData: TableToParamTaskType, params: ParamType[]) => {
    if (isArray(params) && params.filter((o) => o.paramName !== 'userId').length > 0) {
        const listAppAndParams = await dbGaio()
            .query(
                ` SELECT params FROM apps
                        WHERE appId = {appId: String}`,
                {
                    params: { appId: taskData.appId },
                    parse: ['params']
                }
            )
            .then((res) => {
                if (res[0] && res[0].params && isArray(res[0].params)) {
                    return res[0].params.filter((o: ParamType) => o.paramName !== 'userId')
                } else {
                    return []
                }
            })
            .catch(() => [])

        const newParams = unionBy(params, listAppAndParams, 'paramName')

        return await dbGaio().exec(
            `UPDATE apps SET params = {params: String} 
                WHERE appId = {appId: String}`,
            {
                params: { params: JSON.stringify(newParams), appId: taskData.appId },
                stringify: ['params']
            }
        )
    }
    return { status: 'done' }
}
