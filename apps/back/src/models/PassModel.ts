import { dbGaio } from '../db/db.gaio'

const getListOfAppsBucketHasAccess = async (appId: string) => {
    return await dbGaio('listPass')
        .query(
            ` SELECT sees
                    FROM pass
                    WHERE appId = {appId: String} LIMIT 1`,
            {
                params: {
                    appId
                }
            }
        )
        .then((res) => (res[0] ? res[0]['sees'] : []))
}

const createRepoPassOnRepository = async (repoId: string, appId: string, password: string, userId: string) => {
    return await dbGaio('insertPass').insert('pass', [
        {
            repoId,
            appId,
            password,
            sees: [],
            modifiedBy: userId,
            createdBy: userId
        }
    ])
}

const saveSees = async (appId: string, repoId: string, sees: string[]) => {
    return await dbGaio('updatePass').exec(
        `
            ALTER TABLE pass 
                UPDATE sees = {sees: Array(Nullable(String))} 
                WHERE appId = {appId: String} 
                AND repoId = {repoId: String}`,
        {
            params: {
                sees,
                appId,
                repoId
            }
        }
    )
}

const getPassPassword = async (appId: string, repoId: string) => {
    return await dbGaio('getPassCredentials').query(
        `
                SELECT password 
                    FROM pass 
                    WHERE appId = {appId: String} 
                AND repoId = {repoId: String} LIMIT 1`,
        {
            params: {
                appId,
                repoId
            }
        }
    )
}

const deletePassByAppId = async (appId: string) => {
    return await dbGaio('deletePass').exec(`DELETE FROM pass WHERE appId = {appId: String}`, {
        params: {
            appId
        }
    })
}

export default {
    getListOfAppsBucketHasAccess,
    createRepoPassOnRepository,
    deletePassByAppId,
    getPassPassword,
    saveSees
}
