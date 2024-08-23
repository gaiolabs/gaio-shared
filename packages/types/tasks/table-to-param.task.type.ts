import type { CommonTaskType } from './common.task.type'

export type TableToParamTaskType = Partial<{
    byReference: boolean
    saveAsDefault: boolean
    fieldToParamList: Array<{ paramName: string; columnName: string; dataType: string }>
}> &
    CommonTaskType
