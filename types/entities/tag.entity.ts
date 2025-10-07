/**
 * @description Refers to the "tag" schema from database
 */
export type TagEntity = {
	userId: string
	refId: string
	role: string // 'view'
	type: string // 'app'
	createdBy: string
	modifiedBy: string
	createdAt: Date
	updatedAt: Date
}
