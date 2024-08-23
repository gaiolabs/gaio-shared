import type { AppType, MetaType, UserType } from '@gaio/types'
import { getId } from '@gaio/utils'
import type { Context } from 'hono'
import { MetaModel } from '../../../models'

export const listDiscovery = async (c: Context) => {
    const { appId } = await c.req.json<Partial<AppType>>()

    return c.json(MetaModel.getMetasByAppId(appId))
}

export const saveMeta = async (c: Context) => {
    const user = c.get('user') satisfies UserType
    const body = await c.req.json<{ metaData: MetaType }>()
    const { metaData } = body

    if (!metaData.metaId) {
        metaData.metaId = getId()
        return await MetaModel.insertMeta(metaData)
    }

    return c.json(MetaModel.saveMeta(metaData, user))
}

export const updateHits = async (c: Context) => {
    const user = c.get('user') satisfies UserType
    const body = await c.req.json<{ metaId: string }>()
    const { metaId } = body

    return c.json(MetaModel.updateHits(metaId, user))
}
