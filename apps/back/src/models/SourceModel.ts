import type { CredentialsType, SourceType, UserType } from '@gaio/types'
import { dbGaio } from '../db/db.gaio'

const getSources = async () => {
    return await dbGaio('getSources').query(
        `SELECT sourceId, sourceName, client
            FROM source`
    )
}

const deleteSource = async (sourceId: string) => {
    return dbGaio('deleteSource').query(
        `
                ALTER TABLE source 
                    DELETE WHERE sourceId = {sourceId: String}`,
        { params: { sourceId } }
    )
}

const getSourceById = async (sourceId: string): Promise<CredentialsType> => {
    return (await dbGaio('getSource')
        .query(
            `SELECT sourceId, credentials
                FROM source
                WHERE sourceId = { sourceId: String }`,
            {
                parse: ['credentials'],
                params: { sourceId }
            }
        )
        .then((res) => {
            return res
                .map((o) => {
                    const { credentials } = o
                    return {
                        sourceId: o.sourceId,
                        ...credentials
                    }
                })
                .reduce((acc, val) => Object.assign(acc, val), {})
        })) as CredentialsType
}
const getSourceByUser = async ({ userId }: UserType) => {
    return await dbGaio('getSourceByUser')
        .query<SourceType[]>(
            `SELECT source.client as client,
                    source.sourceName as sourceName,
                    source.sourceId as sourceId,
                    source.credentials as credentials
                FROM source
                INNER JOIN tag ON tag.refId = source.sourceId
                WHERE tag.type = 'source'
                    AND tag.userId = { userId: String }`,
            {
                parse: ['credentials'],
                params: { userId }
            }
        )
        .then((res) => {
            return res.map((o) => {
                const { credentials } = o
                const { database: databaseName } = credentials
                return {
                    sourceId: o.sourceId,
                    client: o.client,
                    sourceName: o.sourceName,
                    databaseName,
                    sourceType: 'source'
                }
            })
        })
}

const getSourcesInTagByType = async (sourceId: string) => {
    return await dbGaio('getSourcesInTagByType').query(
        `SELECT source.sourceId, source.sourceId as refId, source.sourceName as name, 'source' AS type
            FROM source
            INNER JOIN tag ON tag.refId = source.sourceId
            WHERE source.sourceId = {sourceId: String}
            AND tag.type = 'source'`,
        {
            params: { sourceId }
        }
    )
}

const getSourcesToTagControl = async (userId?: string) => {
    if (userId) {
        return await dbGaio('getSourcesToTagControl').query(
            `SELECT source.sourceId, source.sourceId as refId, source.sourceName as name, 'source' AS type
                FROM source
                INNER JOIN tag ON tag.refId = source.sourceId
                WHERE tag.userId = {userId: String}
                AND tag.type = 'source'`,
            {
                params: { userId }
            }
        )
    }
    return await dbGaio('getSourcesToTagControl').query(
        `SELECT sourceId, sourceId as refId, sourceName as name, 'source' AS type
            FROM source`
    )
}

const saveSource = async (sourceData: SourceType, contextUser: UserType) => {
    return await dbGaio('saveSource').exec(
        `
            ALTER TABLE source
                UPDATE sourceName = {sourceName: String},
                        credentials = {credentials: String},
                        client = {client: String},
                        modifiedBy = {modifiedBy: String},
                        updatedAt = NOW()
                WHERE sourceId = {sourceId: String}`,
        {
            params: {
                sourceId: sourceData.sourceId,
                sourceName: sourceData.sourceName,
                client: sourceData.client,
                credentials: sourceData.credentials,
                modifiedBy: contextUser.userId
            },
            stringify: ['credentials']
        }
    )
}

const createSource = async (sourceData: SourceType, contextUser: UserType) => {
    return await dbGaio('createSource').insert('source', [
        {
            sourceId: sourceData.sourceId,
            sourceName: sourceData.sourceName,
            credentials: JSON.stringify(sourceData.credentials),
            client: sourceData.client,
            createdBy: contextUser.userId,
            modifiedBy: contextUser.userId
        }
    ])
}

const getSourceCredentials = async (sourceId: string) => {
    return await dbGaio('getSourceCredentials')
        .query(
            `SELECT credentials, client
                FROM source 
                WHERE sourceId = {sourceId: String}
                LIMIT 1`,
            { params: { sourceId }, parse: ['credentials'] }
        )
        .then((res) => {
            if (res[0] && res[0].credentials) {
                return {
                    ...res[0].credentials,
                    client: res[0].client
                }
            }
        })
}

export default {
    getSources,
    saveSource,
    createSource,
    deleteSource,
    getSourceById,
    getSourceByUser,
    getSourceCredentials,
    getSourcesInTagByType,
    getSourcesToTagControl
}
