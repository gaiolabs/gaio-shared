import { type CommonTaskType } from './common.task.type'

export type UserTaskType = Partial<{
	type: 'userMirror'
	fields: string[]
	userType: string
}> &
	CommonTaskType

