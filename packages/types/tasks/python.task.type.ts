import { type CommonTaskType } from './common.task.type'

export type PythonTaskType = Partial<{
    body: string
}> &
    CommonTaskType
