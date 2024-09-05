
/**
 * @description Refers to the "source" schema from database
 */
export type SourceEntity = {
	sourceId: string
	sourceName: string
	credentials: string // '{}'
	options: string // '{}'
	createdBy: string
	modifiedBy: string
	createdAt: Date
	updatedAt: Date
	client: string // 'clickhouse'
}
