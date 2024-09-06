
/**
 * @description Refers to the "meta" schema from database
 */
export type MetaEntity = {
	metaId: string
	label: string
	tableName: string
	databaseName: string
	options: string
	fields: string
	appId: string
	description: string
	status: string // 'active'
	userFilter: string
	hits: string // 1
	updatedAt: Date
	createdAt: Date
	modifiedBy: string
	createdBy: string
	type: string // 'power'
	repoId: string
}
