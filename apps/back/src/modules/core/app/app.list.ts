import type { UserType } from '@gaio/types'
import { AppModel } from '../../../models'

export const appList = async (appIds: string[], user: UserType) => {
    if (!appIds || !appIds.length) {
        return await AppModel.getAllApps(user)
    }
    return await AppModel.getAppsByIds(appIds, user)
}
