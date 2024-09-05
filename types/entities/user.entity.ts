
/**
 * @description Refers to the "user" schema from database
 */
export type UserEntity = {
	userId: string
	name: string
	email: string
	password: string
	lang: string
	token: string
	options: string
	role: string
	status: string
	twoFactorKey: string
	twoFactorSigned: string
	twoFactorStatus: string
	profileId: string
	createdBy: string
	modifiedBy: string
	createdAt: Date
	updatedAt: Date
	deleted: boolean
	tags: Array<unknown>
}
