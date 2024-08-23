import type { UserType } from '@gaio/types'
import { getBucketNameFromAppId, getId, getRepositoryUserNameFromAppId } from '@gaio/utils'
import type { Context } from 'hono'
import { isArray } from 'lodash-es'
import { repositoryInstance } from '../../../db/db.clickhouse'
import { AppModel, PassModel } from '../../../models'

type ShareDataType = {
    appId: string
    repoId: string
    sees: string[]
    revokeList: string[]
}

export const listOfSharedApps = async (c: Context) => {
    return c.json(AppModel.appShared())
}
export const setupSharedApps = async (c: Context) => {
    const shareData: ShareDataType = await c.req.json()
    const userContext: UserType = c.get('user')
    await upsetSees(shareData, userContext.userId)
    await removeSeesFromThisApps(shareData.appId, shareData.repoId, shareData.revokeList)
    await addUserAndDefineGrants(shareData)
    return c.json({
        status: 'done'
    })
}

const addUserAndDefineGrants = async (shareData: ShareDataType) => {
    const repoDb = repositoryInstance(shareData.repoId)
    for (const seeId of shareData.sees) {
        const passResult = await PassModel.getPassPassword(seeId, shareData.repoId)

        if (passResult && passResult.length > 0) {
            const password = passResult[0].password as string
            const bucket = getBucketNameFromAppId(seeId)
            const userSee = getRepositoryUserNameFromAppId(seeId)
            const userApp = getRepositoryUserNameFromAppId(shareData.appId)

            //  make sure app/user exists, if no create
            await defineUserAtBucket(seeId, shareData.repoId, password)

            // create database of this app/user, if not exit
            await repoDb.query(`CREATE DATABASE IF NOT EXISTS ${bucket}`).catch(() => console.log)

            // grant all privileges to it
            await repoDb.query(`GRANT ${grantOptions} ON ${bucket}.* TO ${userSee}`).catch(() => console.log)
            await repoDb.query(`GRANT ${grantOptionsGlobalScope} ON *.* TO ${userSee}`).catch(() => console.log)

            // grant privileges to that app that want see everything from some app/user
            await repoDb.query(`GRANT ${grantOptions} ON ${bucket}.* TO ${userApp}`).catch(() => console.log)
            await repoDb.query(`GRANT ${grantOptionsGlobalScope} ON *.* TO ${userApp}`).catch(() => console.log)
        }
    }
}

const upsetSees = async (shareData: ShareDataType, userId: string) => {
    const { appId, repoId, sees } = shareData

    const pass = await PassModel.getPassPassword(appId, repoId)
    const password = getId()

    if (pass && pass.length > 0) {
        await PassModel.saveSees(appId, repoId, sees)
    } else {
        await PassModel.createRepoPassOnRepository(repoId, appId, password, userId)
    }

    await defineUserAtBucket(shareData.appId, shareData.repoId, password)

    return { status: 'done' }
}

const defineUserAtBucket = async (appId: string, repoId: string, password: string) => {
    const userApp = getRepositoryUserNameFromAppId(appId)
    const bucket = getBucketNameFromAppId(appId)
    const repoDb = repositoryInstance(repoId)

    await repoDb.query(`DROP USER IF EXISTS ${userApp}`).catch((err) => console.log(err))

    await repoDb
        .query(
            `CREATE USER IF NOT EXISTS ${userApp} 
                SETTINGS PROFILE 'default' IDENTIFIED
                WITH PLAINTEXT_PASSWORD BY '${password}'`
        )
        .catch((err) => console.log(err))

    await repoDb.query(`GRANT ${grantOptions} ON ${bucket}.* TO ${userApp}`).catch(() => console.log)
    await repoDb.query(`GRANT ${grantOptionsGlobalScope} ON *.* TO ${userApp}`).catch(() => console.log)
}

const removeSeesFromThisApps = async (appId: string, repoId: string, revokeList: string[]) => {
    const userApp = getRepositoryUserNameFromAppId(appId)
    const repoDb = repositoryInstance(repoId)
    for (const seeId of revokeList) {
        // revokes all privileges to it
        if (seeId !== appId) {
            // create database of this app/user, if not exit
            await repoDb
                .query(`CREATE DATABASE IF NOT EXISTS bucket_${getBucketNameFromAppId(seeId)}`)
                .catch(() => console.log)
            const grants = await repoDb.query(`SHOW GRANTS FOR ${userApp}`).catch((err) => console.log(err))

            const doesGrantExist =
                isArray(grants) &&
                grants.some((o) => Object.values(o).some((v) => `${v}`.includes(`${getBucketNameFromAppId(seeId)}`)))

            // just revoke if existed, or fall out on exception
            if (doesGrantExist) {
                await repoDb
                    .query(`REVOKE ALL PRIVILEGES ON ${getBucketNameFromAppId(seeId)}.* FROM ${userApp}`)
                    .catch(() => console.log)
            }
        }
    }
    return { status: 'done' }
}

// const retrieveRepoPass = async (appId: string, repoId: string, userId: string) => {
//     // take care we filter repoId too, in case of power-user changes apps repo
//     let password = (await PassModel.getPassPassword(appId, repoId).then((res) =>
//         res[0] ? res[0].password : ''
//     )) as string
//
//     if (!password) {
//         password = getId(6) as string
//         await PassModel.createRepoPassOnRepository(repoId, appId, password, userId)
//     }
//
//     return password || getId(6)
// }

const grantOptionsGlobalScope = `
                    HDFS, 
                    ODBC, 
                    jdbc, 
                    remote, 
                    s3, 
                    file, 
                    create temporary table, 
                    create function, 
                    drop function, 
                    url, 
                    MONGO`
const grantOptions = ` SHOW, 
                    SELECT, 
                    INSERT, 
                    ALTER, 
                    CREATE DATABASE, 
                    CREATE TABLE, 
                    CREATE VIEW, 
                    CREATE DICTIONARY, 
                    DROP, 
                    TRUNCATE, 
                    OPTIMIZE, 
                    SYSTEM MERGES, 
                    SYSTEM TTL MERGES, 
                    SYSTEM FETCHES, 
                    SYSTEM MOVES, 
                    SYSTEM SENDS, 
                    SYSTEM REPLICATION QUEUES, 
                    SYSTEM DROP REPLICA, 
                    SYSTEM SYNC REPLICA,
                    SYSTEM RESTART REPLICA, 
                    SYSTEM RESTORE REPLICA, 
                    SYSTEM FLUSH DISTRIBUTED, 
                    dictGet `
