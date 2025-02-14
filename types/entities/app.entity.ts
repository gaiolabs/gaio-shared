
/**
 * @description Refers to the "app" schema from database
 */
export type AppEntity = {
	appId: string
	appName: string
	appDescription: string
	appStatus: string // 'dev',
	appToken: string
	params: string //'[]',
	forms: string // '[]',
	options: string
	repoId: string
	createdBy: string
	createdAt: Date
	modifiedBy: string
	updatedAt: Date
}
