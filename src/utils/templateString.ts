import type { ParamType } from '@gaio/types'
import { template, templateSettings } from 'lodash-es'

export default (query: string, params: ParamType[], extraData = {}) => {
    query = query || ' '
    templateSettings.interpolate = /{{([\s\S]+?)}}/g
    const compiled = template(query)
    return compiled(organizeParamsByKey(params, extraData))
}

const organizeParamsByKey = (params: ParamType[], extraData: Record<string, unknown>) => {
    let results = {}

    for (const par of params) {
        if (`${par.paramValue}`.trim().startsWith('{{')) {
            results[par.paramName] = `${par.paramValue.replace(/\{{|\}}/gi, '')}` || par.value || ''
        } else if (isNumber(par.paramValue)) {
            results[par.paramName] = Number(par.paramValue)
        } else {
            results[par.paramName] = par.paramValue || par.value || ''
        }
    }

    if (extraData && Object.keys(extraData).length > 0) {
        results = { ...results, ...extraData }
    }

    return results
}

const isNumber = (n: string) => {
    if (typeof n === 'string') {
        if (n.trim().startsWith('0') && !n.trim().startsWith('0.')) {
            return false
        }
    }
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n)
}
