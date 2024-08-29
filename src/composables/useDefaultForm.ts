import type { FormType } from '@gaio/shared/types'
import { definedOrDefault, getId, withoutNullProperties } from '@gaio/shared/utils'
import { cloneDeep } from 'lodash-es'

export default (base: FormType) => {
	const sourceProperties = cloneDeep(base)

	return withoutNullProperties({
		formId: definedOrDefault(sourceProperties.formId, getId()),
		flowId: definedOrDefault(sourceProperties.flowId, undefined),
		fieldSize: definedOrDefault(sourceProperties.fieldSize, 'small'),
		formName: definedOrDefault(sourceProperties.formName, 'Form Title'),
		formDescription: definedOrDefault(sourceProperties.formDescription, ''),
		formOnError: definedOrDefault(sourceProperties.formOnError, undefined),
		formOnSuccess: definedOrDefault(sourceProperties.formOnSuccess, 'Success'),
		formType: definedOrDefault(sourceProperties.formType, 'loadFlow'),
		formReload: definedOrDefault(sourceProperties.formReload, false),
		formConfirm: definedOrDefault(sourceProperties.formConfirm, false),
		formConfirmTitle: definedOrDefault(sourceProperties.formConfirmTitle, 'Confirm'),
		formConfirmDescription: definedOrDefault(sourceProperties.formConfirmDescription, 'Are you sure'),
		formClearOnStart: definedOrDefault(sourceProperties.formClearOnStart, false),
		formResetParams: definedOrDefault(sourceProperties.formResetParams, true),
		formForceDefault: definedOrDefault(sourceProperties.formForceDefault, true),
		formElements: definedOrDefault(sourceProperties.formElements, [
			{
				id: getId(),
				cols: {
					[getId()]: []
				}
			}
		])
	}) as FormType
}
