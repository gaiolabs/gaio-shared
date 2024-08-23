import { type CommonTaskType } from './common.task.type'

export type ParamToTableTaskType = Partial<{
    params: string[]
    byReference: boolean
    saveAsDefault: boolean
    fieldToParamList: Array<{ paramName: string; columnName: string; dataType: string }>
}> &
    CommonTaskType
