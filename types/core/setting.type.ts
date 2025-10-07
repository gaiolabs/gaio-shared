import { GenericType } from '../generic.type'
import { CommonTableType } from './common-table.type'

export type SettingType = Partial<{
	settingId: string
	options: GenericType
}> &
	CommonTableType
