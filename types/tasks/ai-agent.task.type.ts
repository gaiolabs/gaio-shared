import type { CommonTaskType } from './common.task.type'

export type AiAgentTaskType = {
    type: 'aiAgent'
    prompt: string
    outputFormat: string
    outputFormatEnabled: boolean
    systemPrompt: string
    retryOnFail: boolean
    retryMaxTries: number
    retryWaitBetweenTries: number
    insertMode: boolean
    aiResourceId: string
    resultType: 'param' | 'table'
    resultDataType: 'String' | 'JSON'
    resultReference: string
} & CommonTaskType
