import type { UserType } from '@gaio/types'
import type { Context } from 'hono'
import { MetaModel, MetaStoriesModel, MetaViewModel } from '../../../models'

export const listPowerReferences = async (c: Context) => {
    const user = c.get('user') satisfies UserType

    const [contexts, views, stories] = await Promise.all([
        MetaModel.getMetasByUserTag(user.userId),
        MetaViewModel.getMetaViewsByUser(user.userId),
        MetaStoriesModel.getMetaStoriesByUser(user.userId)
    ])

    return c.json({
        contexts,
        views,
        stories
    })
}
