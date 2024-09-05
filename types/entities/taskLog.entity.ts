
/**
 * @description Refers to the "taskLog" schema from database
 */
export type TaskLogEntity = {
	taskLogId: string
	tasks: string // '{}'
	appId: string
	userId: string
	flowId: string
	status: string // 'started'
	aborted: string // false
	startedAt: string
	endedAt: string
}
