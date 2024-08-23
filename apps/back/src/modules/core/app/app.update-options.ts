import type { AppType, UserType } from '@gaio/types'
import type { Context } from 'hono'
import { AppModel } from '../../../models'

export const updateAppOptions = async ({ appId, options }: Partial<AppType>, user: UserType) => {
    await AppModel.mergeAppOptions(user.userId, appId, options)
    return { status: 'done' }
}
