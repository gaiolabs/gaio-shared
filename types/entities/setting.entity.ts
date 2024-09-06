
/**
 * @description Refers to the "setting" schema from database
 */
export type SettingEntity = {
	settingId: string
	options: string // '{}'
	createdBy: string
	modifiedBy: string
	createdAt: Date
	updatedAt: Date
}
