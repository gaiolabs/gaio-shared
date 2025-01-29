import type { CommonTaskType } from './common.task.type'

export type TableToParamTaskType = Partial<{
    type: 'tableToParam'
    byReference: boolean
    saveAsDefault: boolean
    fieldToParamList: Array<{ paramName: string; columnName: string; dataType: string }>
}> &
    CommonTaskType
