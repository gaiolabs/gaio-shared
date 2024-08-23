import type { MetaType, UserType } from '@gaio/types'
import { dbGaio } from '../db/db.gaio'

const updateHits = async (metaId: string, userContext: UserType) => {
    return await dbGaio().exec(
        `ALTER TABLE metas
                UPDATE hits = hits + 1,
                        modifiedBy = {modifiedBy: String},
                        updatedAt = now()
                WHERE metaId = {metaId: String}`,
        {
            params: {
                metaId,
                modifiedBy: userContext.userId
            }
        }
    )
}

const insertMeta = async (metaData: MetaType) => {
    await dbGaio().insert('metas', [metaData])
}

const deleteMetaByAppId = async (appId: string) => {
    return await dbGaio().exec(`DELETE FROM metas WHERE appId = {appId: String}`, {
        params: {
            appId
        }
    })
}

const saveMeta = async (metaData: MetaType, userContext: UserType) => {
    return await dbGaio().exec(
        `ALTER TABLE metas 
                UPDATE label = {label: String},
                        description = {description: String},
                        options = {options: String},
                        databaseName = {databaseName: String},
                        tableName = {tableName: String},
                        repoId = {repoId: String},
                        appId = {appId: String},
                        status = {status: String},
                        userFilter = {userFilter: String},
                        fields = {fields: String},
                        modifiedBy = {modifiedBy: String},
                        createdBy = {createdBy: String}
                        WHERE metaId = {metaId: String}`,
        {
            params: {
                modifiedBy: userContext.userId,
                createdBy: userContext.userId,
                label: metaData.label,
                description: metaData.description,
                options: metaData.options,
                databaseName: metaData.databaseName,
                tableName: metaData.tableName,
                status: metaData.status,
                userFilter: metaData.userFilter,
                fields: metaData.fields,
                repoId: metaData.repoId,
                appId: metaData.appId,
                metaId: metaData.metaId
            },
            stringify: ['options', 'fields']
        }
    )
}

const getMetasByAppId = async (appId: string) => {
    return await dbGaio('metasByApp').query(
        ` SELECT *, 'power' as metaType, 'powerView' as icon FROM metas 
                    WHERE appId in ({appId: String})`,
        {
            params: {
                appId
            },
            parse: ['options', 'fields']
        }
    )
}

const getMetasByUserTag = async (userId: string) => {
    return await dbGaio('metasByUserTag').query(
        `SELECT *, 'context' as metaType, 'powerView' as icon FROM metas
	        INNER JOIN tag ON tag.refId = metas.appId
	        WHERE tag.userId = {userId: String}`,
        {
            params: {
                userId
            },
            parse: ['options', 'fields']
        }
    )
}

export default {
    getMetasByAppId,
    getMetasByUserTag,
    deleteMetaByAppId,
    insertMeta,
    saveMeta,
    updateHits
}
