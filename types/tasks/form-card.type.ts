import type { PositionType } from '../core/flow.type'
import type { CommonTaskType } from './common.task.type'

export type FormCardType = Partial<{
    id: string
    appId: string
    label: string
    formId: string
    buttonSize: string
    buttonTheme: string
    buttonTitle: string
    formLoadType: string
    removeCardStyle: boolean
    formFilterBehavior: boolean
    position: PositionType
}> &
    CommonTaskType
