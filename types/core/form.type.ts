export type FormElementsType = { cols: { [key: string]: FormFieldType[] }; id: string }

export type FormType = Partial<{
	formId: string
	flowId: string
	fieldSize: string
	formLabel: string
	formName: string
	formDescription: string
	formOnError: string
	formOnSuccess: string
	formType: string // could be further refined to 'loadFlow' | 'callFlow'
	formReload: boolean
	formConfirm: boolean
	formConfirmTitle: string
	formConfirmDescription: string
	formClearOnStart: boolean
	formResetParams: boolean
	formForceDefault: boolean
	formElements: FormElementsType[]
}>

export type FormFieldType = Partial<{
	id: string
	label: string
	type: string
	source: string
	required: boolean
	isButton: boolean
	hidden: boolean
	value: string | number | string[] | number[] // since it's an array with empty elements, it should be any[].
	extraValue: string | number | string[] | number[] // since it's an array with empty elements, it should be any[].
	list: { value: string; label: string; default?: boolean }[]
	placeholder: string
	description: string
	min: number | undefined
	max: number | undefined
	step: number | undefined
	paramName: string
	textareaRows: number
	labelFormat: string
	fieldSize: string
	readonly: boolean
	longText: boolean
	extraParamName: string
	all: boolean
	multiple: boolean
	datePickerType: string
	choices: any[] // assuming choices can be of any type
	valueIsNumber: boolean
	isVertical: boolean
	isRange: boolean
	sliderType: string
	sliderShowStops: boolean
	sliderMinValue: number
	sliderMaxValue: number
	sliderStepValue: number
	bucketDatabase: string
	bucketTable: string
	bucketFieldLabel: string
	bucketFieldLimit: number
	bucketFieldValue: string
	bucketFieldOrder: 'asc' | 'desc' | undefined
}>
