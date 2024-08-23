import { type CommonTaskType } from './common.task.type'

export type UserTaskType = Partial<{
    fields: string[]
    userType: string
}> &
    CommonTaskType
