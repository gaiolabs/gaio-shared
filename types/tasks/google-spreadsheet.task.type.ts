import { type CommonTaskType } from './common.task.type'

export type GoogleSpreadsheetTaskType = Partial<{
    insertMode: boolean
    url: string
}> &
    CommonTaskType
