import type { SettingType, UserType } from '@gaio/types'
import type { Context } from 'hono'
import { SettingModel } from '../../../models'

export const getSetting = async (c: Context) => {
    const settingId: string = await c.req.json()
    const setting = await SettingModel.getSetting(settingId)
    return c.json(setting)
}

export const updateSetting = async (c: Context) => {
    const userContext: UserType = c.get('user')
    const { settingData }: { settingData: SettingType } = await c.req.json()
    const setting = await SettingModel.upsertSetting(settingData, userContext)
    return c.json(setting)
}
