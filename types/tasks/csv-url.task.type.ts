import { type CommonTaskType } from './common.task.type'

export type CsvUrlTaskType = Partial<{
    type: 'csvUrl'
    url: string
    fileFormatType: string
    insertMode: boolean
    resultDatabase: string
    resultTable: string
    schemaInference: string
}> &
    CommonTaskType
