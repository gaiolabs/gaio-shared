import type { CommonTableType } from './common-table.type'

export type CredentialsType = {
	user?: string
	password?: string

	host?: string
	port?: number | string // kept union to allow tcpPort-style usage if needed

	warehouse?: string

	extraPort?: number
	ssl?: boolean

	database?: string
	canExecuteRaw?: boolean
	client?: string

	accessKey?: string
	secretKey?: string

	bucketName?: string
	loginUrl?: string
	token?: string
	sid?: string
	serviceName?: string

	oracleAlternativeDriver?: boolean
	oracleCaseSensitive?: boolean

	schema?: string
	schemaName?: string

	httpPath?: string
	encrypt?: boolean
	encryptSource?: boolean
	connectString?: string
	account?: string
	databricksConfigFile?: string
	tcpPort?: number | string
	secure?: boolean
	tdsVersion?: { label: string; value: '7_1' | '7_2' | '7_3' | '7_4' | null }
}

export type SourceType = Partial<{
	sourceId: string
	repoId: string
	sourceName: string
	repoName: string
	client: string
	databaseName: string
	shared?: boolean

	credentials: CredentialsType
}> &
	CommonTableType
