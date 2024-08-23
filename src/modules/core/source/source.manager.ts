import type { SourceType, UserType } from '@gaio/types'
import { getId } from '@gaio/utils'
import type { Context } from 'hono'
import { SourceModel, TagModel } from '../../../models'

export const listSources = async (c: Context) => {
    return c.json(SourceModel.getSources())
}

export const deleteSource = async (c: Context) => {
    const sourceId = c.req.param('sourceId')
    // need to implement deleteSource in singleton
    await SourceModel.deleteSource(sourceId)
    return c.json({
        status: 'done'
    })
}

export const getSourceDataById = async (c: Context) => {
    const sourceId = c.req.param('sourceId')
    return c.json(
        SourceModel.getSourceById(sourceId).then((res) => {
            delete res.password
            delete res.user
            return res
        })
    )
}

export const upsertSource = async (c: Context) => {
    const userContext = c.get('user')
    const { sourceData } = await c.req.json()

    if (sourceData.sourceId) {
        await SourceModel.saveSource(sourceData, userContext)
    } else {
        const sourceId = getId()
        await SourceModel.createSource(
            {
                sourceId,
                sourceName: sourceData.sourceName,
                credentials: sourceData.credentials,
                client: sourceData.client,
                createdBy: userContext.userId,
                modifiedBy: userContext.userId
            },
            userContext
        )
        await TagModel.insertTagPermission([
            {
                userId: userContext.userId,
                refId: sourceId,
                role: 'view',
                type: 'source',
                createdBy: userContext.userId,
                modifiedBy: userContext.userId
            }
        ])
    }

    return c.json({
        status: 'done'
    })
}
