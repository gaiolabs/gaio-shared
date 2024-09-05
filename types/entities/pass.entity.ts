
/**
 * @description Refers to the "pass" schema from database
 */
export type PassEntity = {
	appId: string
	repoId: string
	password: string
	createdBy: string
	modifiedBy: string
	createdAt: Date
	updatedAt: Date
	sees: Array<unknown>
}
