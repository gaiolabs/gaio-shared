
/**
 * @description Refers to the "app" schema from database
 */
export type AppEntity = {
	appId: string
	appName: string
	appDescription: string | null
	appStatus: string // 'dev',
	appToken: string
	params: string //'[]',
	forms: string // '[]',
	options: string
	repoId: string
	createdBy: string | null
	createdAt: Date
	modifiedBy: string | null
	updatedAt: Date
}
