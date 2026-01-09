import type { CommonTaskType } from './common.task.type'

export type OcrParserTaskType = Partial<
    {
        type: 'ocrParser'
        dropTable: boolean
        filePath: string
        resultTable: string
        resultDatabase: string
    } & CommonTaskType
>
