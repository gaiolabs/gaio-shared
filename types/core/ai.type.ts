import {GenericType} from "../generic.type";

export type AiManagerCredentialsType = {
    baseURL: string,
    apiKey: string,
    supplier: string;
    model: string,
} & GenericType

export type AiManagerType = {
    aiManagerId: string;
    aiManagerName: string;
    credentials: AiManagerCredentialsType;
    options: GenericType;
    createdBy: string;
    updatedBy: string;
    updatedAt: string;
    createdAt: string;
}

export type SmartDashItemType = {
    query: string;
    reportType: string; // table, bar, line, pie
    chartAxisX: string;
    chartAxisY: string;
    chartDimensionDataType: string;
    isPercentage: boolean;
}

export type AiMessageType = {
    role: 'user' | 'assistant' | 'system'
    content: string
}

export type AiTaskType = 'dashboard' | 'builder' | 'powerSearch' | 'report'

export type AiChatFlowType = {
    aiManagerId: string;
    messages: AiMessageType[];
    taskType: AiTaskType,
    metaId: string;
    tables: string[];
    appId: string;
}

export type AiProviderType = 'openai' | 'anthropic' | 'cohere' | 'google' | 'deepseek'

export type AiCompletionResultType = {
    content: string
    tokens: {
        prompt: number
        completion: number
        total: number
    }
    provider: AiProviderType
}

export type AiClientConfigType = {
    apiKey: string
    model?: string
    temperature?: number
    maxTokens?: number
    apiUrl?: string
}


