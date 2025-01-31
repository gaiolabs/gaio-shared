import { type CommonTaskType } from './common.task.type'

export type ParamToTableTaskType = Partial<{
    type: 'paramToTable'
    params: string[]
    byReference: boolean
    saveAsDefault: boolean
    fieldToParamList: Array<{ paramName: string; columnName: string; dataType: string }>
}> &
    CommonTaskType
