import {GenericType} from "../generic.type";
import {TableType} from "./table.type";
import {SchemaType} from "./schema.type";
import {RecordNodeLayoutType} from "../tasks/report.type";
import {ReportTypeKeys} from "../tasks/report.keys.type";
import {PositionType} from "./flow.type";

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


export type AiChatFlowType = Partial<{
    /** Unique identifier for the chat flow */
    id: string;
    label: string

    aiManagerId: string;
    taskType: AiTaskType;
    taskCurrentType: string;
    metaId: string;
    appId?: string;
    aiPrompt?: string
    messages?: AiMessageType[];

    // Table-related properties
    tables?: TableType[];
    availableTables?: TableType[];
    showTables?: boolean;
    canRemoveTables?: boolean;
}>

export type AiChatEventType = {
    /** The chat flow id */
    id: string;
    /** The message content, the user input */
    message: string
    /** If is to open the chat */
    openChat: boolean
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
    assistantId: string
    apiKey: string
    model?: string
    temperature?: number
    maxTokens?: number
    apiUrl?: string
}


export type AiFoundationReportResultType = {
    id: string;
    message: string
    reportType: ReportTypeKeys
    reportTitle: string
    queryBuilder: SchemaType
}


export type AiFoundationDashboardResultType = {
    reports: Array<{
        id: string;
        message: string
        reportType: ReportTypeKeys
        position: PositionType
        reportTitle: string
        layout: RecordNodeLayoutType
        queryBuilder: SchemaType
    }>
}


