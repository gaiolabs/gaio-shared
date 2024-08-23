import type { AppType, UserType } from '@gaio/types'
import { getId } from '@gaio/utils'
import type { Context } from 'hono'
import { createAppUserAtBucket } from './app.bucket'
import { AppModel, FlowModel, TagModel } from '../../../models'

export const appSave = async (app: Partial<AppType>, user: UserType) => {
    return !app.appId ? await createApp(app, user) : await updateApp(app, user)
}

const createApp = async (app: Partial<AppType>, user: UserType) => {
    const firstFlowId = getId()
    app.options.studioFlowStart = firstFlowId

    const newApp = await AppModel.createApp(app)

    await TagModel.upsertUserAppPermission(user.userId, newApp.appId, 'edit')

    await FlowModel.createFlow(
        {
            appId: newApp.appId,
            flowName: 'First process',
            flowDescription: '',
            flowType: 'infoPub',
            flowId: firstFlowId
        },
        user.userId
    )

    return await createAppUserAtBucket(newApp.repoId, newApp.appId, user.userId)
}

const updateApp = async (app: Partial<AppType>, user: UserType) => {
    return await AppModel.mergeApp(app, user)
}
