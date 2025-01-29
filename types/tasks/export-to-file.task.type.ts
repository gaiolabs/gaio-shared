import { type CommonTaskType } from './common.task.type'

export type ExportToFileType = Partial<{
    type: 'export'
    separator: string
    compress: boolean
}> &
    CommonTaskType
