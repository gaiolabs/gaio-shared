import type { TagTypePermission, UserType } from '@gaio/types'
import { dbGaio } from '../db/db.gaio'

type Permissions = { tagId: string; role: string }

const changeTagRoleByUser = async (tagData: TagTypePermission, userContext: UserType) => {
    return await dbGaio('changeTagRoleByUser').exec(
        `
            ALTER TABLE tag 
                UPDATE role = {role: String},
                       modifiedBy = {modifiedBy: String},
                       updatedAt = now()
                    WHERE userId = {userId: String}
                        AND refId = {refId: String}
                        AND type = {type: String}
                `,
        {
            params: {
                role: tagData.role,
                modifiedBy: userContext.userId,
                userId: tagData.userId,
                refId: tagData.refId,
                type: tagData.type
            }
        }
    )
}

const upsertUserAppPermission = async (userId: string, appId: string, role = 'view') => {
    const hasPermission = await dbGaio('userAppPermission').query<Permissions[]>(
        `SELECT refId FROM tag 
                WHERE userId = {userId: String} 
                    AND refId = {refId: String} 
                    AND type = 'app'
                LIMIT 1`,
        {
            params: {
                userId,
                refId: appId
            }
        }
    )

    if (hasPermission && hasPermission.length) {
        return await dbGaio('updateTagRole').exec(
            `ALTER TABLE tag 
                UPDATE role = {role: String}, 
                        modifiedBy = {modifiedBy: String} 
                        WHERE tagId = {tagId: String}`,
            {
                params: {
                    role,
                    modifiedBy: userId,
                    tagId: hasPermission[0]['tagId']
                }
            }
        )
    }

    return await dbGaio('insertTagPermission').insert('tag', [
        {
            userId,
            refId: appId,
            role,
            type: 'app',
            createdBy: userId,
            modifiedBy: userId
        }
    ])
}

const insertTagPermission = async (tagData: TagTypePermission[]) => {
    await dbGaio('insertTagPermission').insert(
        'tag',
        tagData.map((tag) => ({
            userId: tag.userId,
            refId: tag.refId,
            role: tag.role || 'view',
            type: tag.type,
            createdBy: tag.userId,
            modifiedBy: tag.userId
        }))
    )
    return {}
}

const removeTag = async (userId: string, refId: string, type: string) => {
    return await dbGaio('removeTag').exec(
        `ALTER TABLE tag 
           DELETE WHERE userId = {userId: String} 
           AND refId = {refId: String} 
           AND type = {type: String}`,
        {
            params: {
                userId,
                refId,
                type
            }
        }
    )
}

const deleteTagByAppId = async (appId: string) => {
    return await dbGaio('deleteTagByAppId').exec(`DELETE FROM tag WHERE refId = {appId: String}`, {
        params: {
            appId
        }
    })
}

export default {
    deleteTagByAppId,
    upsertUserAppPermission,
    insertTagPermission,
    changeTagRoleByUser,
    removeTag
}
