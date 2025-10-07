import { type CommonTaskType } from './common.task.type'
import type { FieldType } from '../core/field.type'

export type QuickTableTaskType = Partial<{
	type: 'quickTable'
	saveReference: boolean
	dropTable: boolean
	transformData: boolean
	columns: FieldType[]
	lastItems: boolean
	data: { [key: string]: any }[]
}> &
	CommonTaskType
