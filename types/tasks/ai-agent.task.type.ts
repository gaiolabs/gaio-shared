import type { CommonTaskType } from './common.task.type'

export type AiAgentTaskType = {
    type: 'aiAgent'
    prompt: string
    toolOutputFormat: string
    outputFormat: string
    outputFormatEnabled: boolean
    systemPrompt: string
    agentId: string
    retryOnFail: boolean
    retryMaxTries: number
    retryWaitBetweenTries: number
    memoryType: string
    memorySize: number
    memorySessionId: string
    memoryExpiration: number
    toolOf: string
    insertMode: boolean
    aiManagerId: string
    aiResourceId: string
    resultType: 'param' | 'table'
    resultDataType: 'String' | 'JSON'
    resultReference: string
} & CommonTaskType
