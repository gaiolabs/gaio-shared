import type { GenericType, ParamType } from '@gaio/types'
import { size } from 'lodash-es'
import * as nunjucks from 'nunjucks'

const { renderString } = nunjucks

export class TemplateService {
    public render(query: string | undefined, params: ParamType[], extraData = {}): string {
        if (!query) {
            return ' '
        }

        return `${renderString(query, TemplateService.organizeParamsByKey(params, extraData))}`
    }

    static organizeParamsByKey(params: ParamType[], extraData: GenericType) {
        let results = {} as GenericType

        for (const par of params) {
            if (`${par.paramValue}`.trim().startsWith('{{')) {
                results[par.paramName] = `${par.paramValue.replace(/\{{|}}/gi, '')}` || par.value || ''
            } else if (TemplateService.isNumber(par.paramValue)) {
                results[par.paramName] = Number(par.paramValue)
            } else {
                results[par.paramName] = par.paramValue || par.value || ''
            }
        }

        // this adds data from listed tables
        if (extraData && size(extraData) > 0) {
            results = { ...results, ...extraData }
        }

        return results
    }

    private static isNumber(n: string | undefined | number) {
        if (n === undefined) {
            return false
        } else if (typeof n === 'string') {
            if (n.trim().startsWith('0') && !n.trim().startsWith('0.')) {
                return false
            }
        }

        return /^-?[\d.]+(?:e-?\d+)?$/.test(n.toString())
    }
}
