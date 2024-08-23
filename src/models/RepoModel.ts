import type { CommonTaskType, CredentialsType, SourceType, UserType } from '@gaio/types'
import { getBucketNameFromAppId, getRepositoryUserNameFromAppId } from '@gaio/utils'
import { dbGaio } from '../db/db.gaio'

const getRepoCredentials = async (taskData: CommonTaskType, role = 'bucket') => {
    // to do: use pass password instead of default
    return (await dbGaio('getRepoCredentials')
        .query(
            `SELECT repo.credentials as credentials,
                    pass.password as password
                FROM repo 
                LEFT JOIN pass ON pass.repoId = repo.repoId
                WHERE repoId = {repoId: String} AND
                        appId = {appId: String}
                LIMIT 1`,
            { params: { repoId: taskData.repoId, appId: taskData.appId }, parse: ['credentials'] }
        )
        .then((res) => {
            if (res[0] && (res[0].credentials as CredentialsType)) {
                return {
                    ...(res[0].credentials as CredentialsType),
                    password: res[0].password,
                    user: getRepositoryUserNameFromAppId(taskData.appId),
                    database:
                        role === 'bucket' ? getBucketNameFromAppId(taskData.appId) : res[0].credentials['database'],
                    client: 'clickhouse'
                }
            }
            return null
        })) as CredentialsType
}

const getRepoDataById = async (repoId: string): Promise<Partial<CredentialsType>> => {
    return await dbGaio('getRepoDataById')
        .query<{ credentials: CredentialsType }[]>(
            `SELECT repo.credentials as credentials
                FROM repo
                WHERE repoId = {repoId: String}
                LIMIT 1`,
            {
                params: {
                    repoId
                },
                parse: ['credentials']
            }
        )
        .then((res) => (res[0] && res[0].credentials) || {})
}

const getListOfRepo = async () => {
    return dbGaio('listRepo').query<SourceType[]>(
        `SELECT 
            repoName, 
            repoId, 
            client, 
            credentials 
        FROM repo`,
        {
            parse: ['credentials']
        }
    )
}

const deleteRepository = async (repoId: string) => {
    return dbGaio('deleteRepo').query(
        `
                ALTER TABLE repo 
                    DELETE WHERE repoId = {repoId: String}`,
        { params: { repoId } }
    )
}

const saveRepo = async (repoData: SourceType, contextUser: UserType) => {
    return await dbGaio('saveRepo').exec(
        `
            ALTER TABLE repo
                UPDATE repoName = {repoName: String},
                        credentials = {credentials: String},
                        client = {client: String},
                        modifiedBy = {modifiedBy: String},
                        updatedAt = NOW()
                WHERE repoId = {repoId: String}`,
        {
            params: {
                repoId: repoData.repoId,
                repoName: repoData.repoName,
                client: repoData.client,
                credentials: repoData.credentials,
                modifiedBy: contextUser.userId
            },
            stringify: ['credentials']
        }
    )
}

const createRepo = async (repoData: SourceType, contextUser: UserType) => {
    return await dbGaio('createRepo').insert('repo', [
        {
            repoId: repoData.repoId,
            repoName: repoData.repoName,
            credentials: JSON.stringify(repoData.credentials),
            client: repoData.client,
            createdBy: contextUser.userId,
            modifiedBy: contextUser.userId
        }
    ])
}

export default { getRepoCredentials, getListOfRepo, getRepoDataById, deleteRepository, createRepo, saveRepo }
