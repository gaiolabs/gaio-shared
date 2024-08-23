import type { ParamType, TaskType } from '@gaio/types'
import { $ } from 'bun'
import templateString from '../../../utils/templateString'

export const runnerCustomParam = async (taskData: TaskType, paramValue: string, params = []) => {
    if (paramValue.includes('params.')) {
        const preParam = templateString(`${paramValue.replace(/params./gi, '')}`, params)

        return await runnerCustomParam(taskData, `{{${preParam}}}`, params)
    }

    return $`clickhouse-local -q "SELECT (${paramValue.replace(/\{{|}}/gi, '')}) AS paramValue limit 1"` // 120
}

export const getCustomParamValue = async (params: ParamType[]) => {
    for await (const param of params) {
        try {
            const { stdout } = await $`clickhouse-local -q "SELECT (${param.paramValue.replace(
                /\{{|}}/gi,
                ''
            )}) AS paramValue limit 1"` // 120
            param.paramValue = stdout.toString()?.trim()?.split('\n')?.join(' ')
        } catch (e) {
            param.paramValue = ''
        }
    }

    return params
}
