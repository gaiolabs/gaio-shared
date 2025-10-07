import mustache from 'mustache'
import { ParamType } from '../../types'

export const parseTemplate = (str: string, params: ParamType[], extraData = {}) => {
	str = str || ' '
	return mustache.render(str, { params: organizeParamsByKey(params, extraData) })
}

const organizeParamsByKey = (params: ParamType[], extraData = {}) => {
	let results = {} as { [key: string]: unknown }

	for (const par of params) {
		if (par.paramValue !== undefined && par.paramName !== undefined) {
			let value
			if (`${par.paramValue}`.trim().startsWith('{{')) {
				value = `${par.paramValue.replace(/{{|}}/gi, '')}` || par.value || ''
			} else if (isNumber(par.paramValue)) {
				value = Number(par.paramValue)
			} else {
				value = par.paramValue || par.value || ''
			}
			results[par.paramName] = value
		}
	}

	if (extraData && Object.keys(extraData).length > 0) {
		results = { ...results, ...extraData }
	}

	return results
}

const isNumber = (n: string | unknown) => {
	if (typeof n === 'string') {
		if (n.trim().startsWith('0') && !n.trim().startsWith('0.')) {
			return false
		}
	}
	return /^-?[\d.]+(?:e-?\d+)?$/.test(n as string)
}
