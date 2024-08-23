import { type CommonTaskType } from './common.task.type'

export type ExportToFileType = Partial<{
    separator: string
    compress: boolean
}> &
    CommonTaskType
