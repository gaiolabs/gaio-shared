import type { CommonTaskType } from './common.task.type'

export type AiAgentTaskType = {
    type: 'aiAgent'
    prompt: string
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
    resultType: 'param' | 'table'
    resultDatType: 'String', 'JSON'
    resultReference: string
} & CommonTaskType
