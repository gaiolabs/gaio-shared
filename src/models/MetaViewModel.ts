import type { MetaViewType, UserType } from '@gaio/types'
import { toDataTimeString } from '@gaio/utils'
import { dbGaio } from '../db/db.gaio'

const getMetaViewsByUser = async (userId: string) => {
    return await dbGaio('getMetaViewsByUser').query(
        `SELECT meta_view.*, 'view' as metaType, 'powerView' as icon FROM meta_view
            LEFT JOIN app ON app.appId = meta_view.appId
	        WHERE userId = {userId: String}`,
        {
            params: {
                userId
            }
        }
    )
}

const createMetaView = async (metaView: MetaViewType, userContext: UserType) => {
    return await dbGaio('createMetaView').insert('meta_view', [
        {
            metaViewId: metaView.metaViewId,
            userId: userContext.userId,
            appId: metaView.appId,
            repoId: metaView.repoId,
            metaId: metaView.metaId,
            label: metaView.label,
            task: metaView.task || {},
            tags: metaView.tags || [],
            options: {},
            shared: metaView.shared,
            createdBy: userContext.userId,
            modifiedBy: userContext.userId,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ])
}

const saveMetaView = async (metaView: MetaViewType, userContext: UserType) => {
    return await dbGaio('saveMetaView').exec(
        `
                ALTER TABLE meta_view
                    UPDATE label = {label: String}, 
                        task = {task: String},
                        tags = {tags: String},
                        options = {options: String},
                        shared = {shared: Boolean},
                        modifiedBy = {modifiedBy: String},
                        updatedAt = {updatedAt: String}
                    WHERE metaViewId = {metaViewId: String}`,
        {
            params: {
                metaViewId: metaView.metaViewId,
                label: metaView.label,
                task: metaView.task || {},
                tags: metaView.tags || [],
                options: metaView.options || {},
                shared: metaView.shared,
                modifiedBy: userContext.userId,
                updatedAt: toDataTimeString()
            },
            stringify: ['task', 'tags', 'options']
        }
    )
}

const deleteMetaViewByAppId = async (appId: string) => {
    return await dbGaio('deleteMetaViewByAppId').exec(`DELETE FROM meta_view WHERE appId = {appId: String}`, {
        params: {
            appId
        }
    })
}

export default {
    deleteMetaViewByAppId,
    getMetaViewsByUser,
    createMetaView,
    saveMetaView
}
