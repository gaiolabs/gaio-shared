import type { AppType, FormType, UserType } from '@gaio/types'
import type { Context } from 'hono'
import { AppModel } from '../../../models'

export const updateAppForms = async ({ appId, forms }: Partial<AppType>, user: UserType) => {
    return await AppModel.updateForms(appId, user.userId, forms)
}
