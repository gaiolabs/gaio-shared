import { type CommonTaskType } from './common.task.type'
import { ParamType } from '../core/param.type'

export type FlowTaskType = Partial<{
	type: 'flow'
	flowId: string
	elseFlowId: string
	loopSize: number
	runType: 'single' | 'conditional'
	params: ParamType[]
}> &
	CommonTaskType
