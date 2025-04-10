import {GenericType} from "../generic.type";

export type ApiKeyType = {
    apiKeyId: string
    apiKeyName: string
    appId: string
    secret: string
    status: 'active' | 'inactive'
    createdBy: string
    createdAt: string
    updateAt: string
    updatedBy: string
}

export type ApiType = Partial<{
    apiId: string
    apiName: string
    description: string
    apiKeyId: string[]
    flowId: string
    appId: string
    tableName: string
    options: GenericType
    status: 'active' | 'inactive'
    createdBy: string
    createdAt: string
    updateAt: string
    updatedBy: string
}>
