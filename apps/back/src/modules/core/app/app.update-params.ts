import type { AppType, ParamType, UserType } from '@gaio/types'
import type { Context } from 'hono'
import { AppModel } from '../../../models'

export const updateAppParams = async ({ appId, params }: Partial<AppType>, user: UserType) => {
    return await AppModel.updateParams(appId, user.userId, params)
}
