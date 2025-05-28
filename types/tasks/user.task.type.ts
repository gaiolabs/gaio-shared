import type{ CommonTaskType } from './common.task.type'

export type UserTaskType = Partial<{
	type: 'userMirror'
	userMirrorFields: string[]
	userType: string
}> &
	CommonTaskType

