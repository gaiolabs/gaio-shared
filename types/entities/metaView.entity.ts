
/**
 * @description Refers to the "metaView" schema from database
 */
export type MetaViewEntity = {
	metaViewId: string
	userId: string
	appId: string
	repoId: string
	metaId: string
	label: string
	task: string
	tags: string
	options: string
	shared: boolean
	modifiedBy: string
	createdBy: string
	modifiedAt: Date
	createdAt: Date
	updatedAt: Date
}
