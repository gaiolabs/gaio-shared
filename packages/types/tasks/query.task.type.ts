import { type CommonTaskType } from './common.task.type'

export type QueryTaskType = Partial<{
    query: string
    prepare: boolean
    limit: number
}> &
    CommonTaskType
