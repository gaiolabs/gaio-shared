import type { SettingType, UserType } from '@gaio/types'
import { dbGaio } from '../db/db.gaio'

const getSetting = async (settingId: string) => {
    return await dbGaio('getSetting')
        .query(
            `SELECT * 
                FROM setting
            WHERE settingId = {settingId: String}`,
            {
                params: { settingId },
                parse: ['options']
            }
        )
        .then((result) => result[0])
}

const upsertSetting = async (settingData: SettingType, userContext: UserType) => {
    const setting = await getSetting(settingData.settingId)

    if (!setting) {
        return await addSetting(settingData, userContext)
    } else {
        return await updateSetting(settingData, userContext)
    }
}

const addSetting = async (settingData: SettingType, userContext: UserType) => {
    return await dbGaio('addSetting').insert('setting', [
        {
            settingId: settingData.settingId,
            options: JSON.stringify(settingData.options),
            createdBy: userContext.userId,
            modifiedBy: userContext.userId
        }
    ])
}

const updateSetting = async (settingData: SettingType, userContext: UserType) => {
    return await dbGaio('updateSetting').exec(
        `
                ALTER TABLE setting
                    UPDATE options = {options: JSON},
                            modifiedBy = {modifiedBy: String},
                            updatedAt = NOW() 
                WHERE settingId = {settingId: String}`,
        {
            params: { settingId: settingData.settingId, options: settingData.options, modifiedBy: userContext.userId },
            stringify: ['options']
        }
    )
}

export default { getSetting, upsertSetting }
