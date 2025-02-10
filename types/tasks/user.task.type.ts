import { type CommonTaskType } from './common.task.type'
import {FieldType} from "../core/field.type";

export type UserTaskType = Partial<{
	type: 'userMirror'
	fields: FieldType[]
	userType: string
}> &
	CommonTaskType

