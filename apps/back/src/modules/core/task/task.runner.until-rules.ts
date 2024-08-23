import type { ParamType, TaskType } from '@gaio/types'
import { cloneDeep, isNil } from 'lodash-es'

type UntilRulesType = {
    untilRuleType: string
    untilOperator: string
    untilParamName: string
    untilParamValue: string
}

export const untilRules = (preTask: TaskType, params: ParamType[]) => {
    // NEED IMPLEMENT PAUSE
    const taskData = cloneDeep<TaskType>(preTask)
    let status = undefined

    const { untilRuleType, untilOperator, untilParamValue, untilParamName } = taskData as UntilRulesType

    if (!isNil(untilRuleType)) {
        if (!isNil(untilParamName) && !isNil(untilOperator) && !isNil(untilParamValue)) {
            const param = cloneDeep(params).find((param) => param.paramName === untilParamName)

            if (!param) {
                return {
                    error: true,
                    message: `Param ${untilParamName} not found`
                }
            }

            // if (param && `${param.paramValue}`.trim().startsWith('{{')) {
            //     const customParam = await runnerCustomParam(task, param.paramValue, params)
            //     param.paramValue = `${customParam.paramValue}`
            // }
            //
            // if (untilParamValue && `${untilParamValue}`.trim().startsWith('{{')) {
            //     const customParam = await runnerCustomParam(task, untilParamValue, params)
            //     untilParamValue = `${customParam.paramValue}`
            // }

            const checkParamValue = `${param.paramValue}`
            const compareUntilParamValue = `${untilParamValue}`

            switch (untilOperator) {
                case '=':
                    if (checkParamValue === compareUntilParamValue) {
                        status = untilRuleType
                    }
                    break
                case '>':
                    if (checkParamValue > compareUntilParamValue) {
                        status = untilRuleType
                    }
                    break
                case '>=':
                    if (checkParamValue >= compareUntilParamValue) {
                        status = untilRuleType
                    }
                    break
                case '<':
                    if (checkParamValue < compareUntilParamValue) {
                        status = untilRuleType
                    }
                    break
                case '<=':
                    if (checkParamValue <= compareUntilParamValue) {
                        status = untilRuleType
                    }
                    break
                case '!=':
                    if (checkParamValue !== compareUntilParamValue) {
                        status = untilRuleType
                    }
                    break
                case 'like':
                    status = `${checkParamValue}`.includes(compareUntilParamValue) ? compareUntilParamValue : status
                    break
                default:
                    status = undefined
                    break
            }
        }
    }

    // if (status === 'pauseTask') {
    //     preTask.paused = true
    // } else if (status === 'stopFlow') {
    //     preTask.stopped = true
    // }
    //
    return { status }
}
