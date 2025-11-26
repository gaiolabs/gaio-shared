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

export type McpToolType = Partial<{
    id: string
    title: string
    description: string
    url: string
    headers: Array<{ prop: string; value: string }>
    type: string
    shared: boolean
}>

export type VerifiedQueryToolType = Partial<{
    id: string
    title: string
    description: string
    query: string
    type: string
    shared: boolean
}>

export type AiResourceType = Partial<{
    aiResourceId: string
    name: string
    description: string
    options: Partial<
        {
            diagram: string[]
            discovery: string[]
            mcpList: string[] // McpToolType[]
            httpRequestList: string[] // HttpRequestToolType[]
            verifiedQueryList: string[] // VerifiedQueryToolType[]
            mcpWikipedia: boolean
            type: string
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

export type HttpRequestToolType = Partial<{
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
    type: string
    shared: boolean
}>

export type HeaderEntry = Partial<{
    prop: string
    value: string
}>

export type QueryParam = Partial<{
    prop: string
    value: string
}>

export type ContextEntry = Partial<{
    type: string
    prop: string
    description: string
    required?: boolean
    nullable?: boolean
}>

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
