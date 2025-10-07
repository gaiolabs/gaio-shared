import type { ParamType } from './param.type'
import { TaskType } from '../tasks/task.type'

export type RunnerTriggerType = {
	appId: string
	flowId: string
	params: ParamType[]
	taskExecutionScope?: { taskPayload?: TaskType; taskIds?: string[] }
}
