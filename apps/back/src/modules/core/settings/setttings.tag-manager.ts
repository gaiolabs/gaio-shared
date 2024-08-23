import type { TagTypePermission, UserType } from '@gaio/types'
import type { Context } from 'hono'
import { uniqBy } from 'lodash-es'
import { AppModel, SourceModel, TagModel, UserModel } from '../../../models'

export const tagManagerList = async (c: Context) => {
    const [apps, tags, sources] = await Promise.all([
        AppModel.getAppsToTagControl(),
        UserModel.getUsersToTagControl(),
        SourceModel.getSourcesToTagControl()
    ])

    return c.json({
        tags,
        apps,
        sources
    })
}

export const listByTag = async (c: Context) => {
    const tagData: TagTypePermission = await c.req.json()
    let tags = []
    let apps = []
    let sources = []

    if (tagData.type === 'user') {
        tags = await UserModel.getUsersToTagControl(tagData.userId)
        apps = await AppModel.getAppsToTagControl(tagData.userId)
        sources = await SourceModel.getSourcesToTagControl(tagData.userId)
    } else {
        tags = await UserModel.getUsersByTagRefAndType(tagData.refId, tagData.type)

        switch (tagData.type) {
            case 'app':
                apps = await AppModel.getAppsInTagByType(tagData.refId)
                break
            case 'source':
                sources = await SourceModel.getSourcesInTagByType(tagData.refId)
                break
        }
    }

    return c.json({
        tags,
        apps,
        sources
    })
}

export const changeTagRole = async (c: Context) => {
    const tagData: TagTypePermission = await c.req.json()
    const userContext: UserType = c.get('user')
    await TagModel.changeTagRoleByUser(tagData, userContext)
    return c.json({
        success: true
    })
}

export const saveGroup = async (c: Context) => {
    const userContext: UserType = c.get('user')
    const { userData }: { userData: UserType } = await c.req.json()
    await UserModel.saveGroup(userData, userContext)
    return c.json({
        status: 'done'
    })
}

export const deleteGroup = async (c: Context) => {
    const { userData }: { userData: UserType } = await c.req.json()
    await UserModel.deleteGroup(userData.userId)
    return c.json({
        status: 'done'
    })
}

export const grantTag = async (c: Context) => {
    const userContext: UserType = c.get('user')
    const {
        userList,
        tagList
    }: {
        userList: UserType[]
        tagList: TagTypePermission[]
    } = await c.req.json()
    const listTagData = []
    const listToRemove = []

    for (const user of userList) {
        for (const tag of tagList) {
            listToRemove.push({
                userId: user.userId,
                refId: tag.refId,
                type: tag.type
            })
            listTagData.push({
                userId: user.userId,
                refId: tag.refId,
                role: tag.role || 'view',
                type: tag.type,
                createdBy: userContext.userId,
                modifiedBy: userContext.userId
            })
        }
    }

    await Promise.all(listToRemove.map((tag) => TagModel.removeTag(tag.userId, tag.refId, tag.type)))
    await TagModel.insertTagPermission(uniqBy(listTagData, (o) => o.userId + o.refId + o.type))

    return c.json({ status: 'success' })
}

export const removeTag = async (c: Context) => {
    const { userList, tagList }: { userList: UserType[]; tagList: TagTypePermission[] } = await c.req.json()
    const listTagData = []
    for (const user of userList) {
        for (const tag of tagList) {
            listTagData.push({
                userId: user.userId,
                refId: tag.refId,
                type: tag.type
            })
        }
    }
    await Promise.all(listTagData.map((tag) => TagModel.removeTag(tag.userId, tag.refId, tag.type)))
    return { status: 'success' }
}
