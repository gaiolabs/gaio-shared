import type { FormFieldType } from '@gaio/shared/types'
import { definedOrDefault, getId, withoutNullProperties } from '@gaio/shared/utils'
import { cloneDeep } from 'lodash-es'

export default (base: FormFieldType) => {
	const field = cloneDeep(base)

	return withoutNullProperties({
		id: getId(),
		label: definedOrDefault(field.label, 'Title'),
		type: definedOrDefault(field.type, 'lineText'),
		source: definedOrDefault(field.source, 'static'),
		required: definedOrDefault(field.required, false),
		isButton: definedOrDefault(field.isButton, false),
		hidden: definedOrDefault(field.hidden, false),
		value: definedOrDefault(field.value, undefined),
		list: definedOrDefault(field.list, []),
		placeholder: definedOrDefault(field.placeholder, ''),
		description: definedOrDefault(field.description, ''),
		min: definedOrDefault(field.min, undefined),
		max: definedOrDefault(field.max, undefined),
		step: definedOrDefault(field.step, undefined),
		paramName: definedOrDefault(field.paramName, ''),
		extraParamName: definedOrDefault(field.extraParamName, ''),
		all: definedOrDefault(field.all, false),
		datePickerType: definedOrDefault(field.datePickerType, 'date'),
		choices: definedOrDefault(field.choices, []),
		valueIsNumber: definedOrDefault(field.valueIsNumber, false),
		sliderType: definedOrDefault(field.sliderType, 'number'),
		sliderShowStops: definedOrDefault(field.sliderShowStops, false),
		sliderMinValue: definedOrDefault(field.sliderMinValue, 0),
		sliderMaxValue: definedOrDefault(field.sliderMaxValue, 100),
		sliderStepValue: definedOrDefault(field.sliderStepValue, 1)
	}) as FormFieldType
}
