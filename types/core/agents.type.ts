import type { GenericType } from '../generic.type'

export type AgentType = Partial<{
    agentId: string
    avatar: string
    name: string
    description: string
    role: string
    goal: string
    backstory: string
    options: string
    settings: string
    appId: string
    createdAt: string // ISO string or Date object
    updatedAt: string // ISO string or Date object
    createdBy: string
    updatedBy: string
}>

export type AiResourceSettingsType = Partial<{
    role: string
    goal: string
    backstory: string
    avatar: string
}> &
    GenericType

export type McpToolType = {
    id: string
    title: string
    description: string
    url: string
    headers: Array<{ prop: string; value: string }>
}

export type AiResourceType = Partial<{
    aiResourceId: string
    name: string
    description: string
    options: Partial<
        {
            diagram: string[]
            discovery: string[]
            mcpList: McpToolType[]
            mcpWikipedia: boolean
            httpRequestList: HttpRequestToolType[]
        } & GenericType
    >
    settings: AiResourceSettingsType
    appId: string
    shared: boolean
    type: string
    createdAt: string // ISO string or Date object
    updatedAt: string // ISO string or Date object
    createdBy: string
    updatedBy: string
}>

export interface HttpRequestToolType {
    id: string
    name: string
    description: string
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    url: string
    headers: HeaderEntry[]
    queryParams: QueryParam[]
    contextEntries: ContextEntry[]
    body?: {
        type: 'json' | 'text'
        content: string
    }
    auth?: {
        username: string
        password: string
    }
}

export interface HeaderEntry {
    prop: string
    value: string
}

export interface QueryParam {
    prop: string
    value: string
}

export interface ContextEntry {
    prop: string
    description: string
    required: boolean
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
