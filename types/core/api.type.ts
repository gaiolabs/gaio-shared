import {GenericType} from "../generic.type";

export type ApiType = Partial<{
    apiId: string
    apiName: string
    description: string
    token: string
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
