import type { ParamType } from '../core/param.type'
import type { CommonTaskType } from './common.task.type'

export type DefineParamTaskType = Partial<{
    params: ParamType[]
    type: 'defineParam'
}> &
    CommonTaskType
