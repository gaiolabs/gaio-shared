import { GenericType } from '../generic.type'

export type ApiKeyType = Partial<{
	apiKeyId: string
	apiKeyName: string
	appId: string[]
	secret: string
	type: 'mcp' | 'app'
	status: 'active' | 'inactive'
	createdBy: string
	createdAt: string
	updateAt: string
	updatedBy: string
}>

export type ApiType = Partial<{
	apiId: string
	apiName: string
	endpoint: string
	description: string
	assignedKeys: string[]
	flowId: string
	appId: string
	tableName: string
	tableInput: string
	inputFirst: boolean
	dropTableInput: boolean
	options: GenericType
	status: 'active' | 'inactive'
	isTool: boolean
	toolMetadata: GenericType
	createdBy: string
	createdAt: string
	updateAt: string
	updatedBy: string
}>
