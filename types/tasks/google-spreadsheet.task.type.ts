import { type CommonTaskType } from './common.task.type'

export type GoogleSpreadsheetTaskType = Partial<{
    type: 'googleSpreadsheet'
    insertMode: boolean
    url: string
}> &
    CommonTaskType
