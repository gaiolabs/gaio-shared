import { getBucketNameFromAppId, getId, getRepositoryUserNameFromAppId } from '@gaio/utils'
import { repositoryInstance } from '../../../db/db.clickhouse'
import { PassModel } from '../../../models'

const clickhouseGrantedFunction = ` HDFS, ODBC, jdbc, remote, s3, file, create temporary table, create function, drop function, url, MONGO `
const clickhouseGrantedScope = ` SHOW, 
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

export const createAppUserAtBucket = async (repoId: string, appId: string, userId: string) => {
    const bucketName = getBucketNameFromAppId(appId)
    const userAppName = getRepositoryUserNameFromAppId(appId)
    const userAppPassword = getId(8)

    await PassModel.createRepoPassOnRepository(repoId, appId, userAppPassword, userId)

    await repositoryInstance(repoId).query(`CREATE DATABASE IF NOT EXISTS ${bucketName}`)

    await repositoryInstance(repoId).query(`DROP USER IF EXISTS ${userAppName}`)

    await repositoryInstance(repoId).query(
        `CREATE USER IF NOT EXISTS ${userAppName}
                SETTINGS PROFILE 'default' IDENTIFIED
                WITH PLAINTEXT_PASSWORD BY '${userAppPassword}'`
    )

    await repositoryInstance(repoId).query(`GRANT ${clickhouseGrantedFunction} ON *.* TO ${userAppName}`)
    await repositoryInstance(repoId).query(`GRANT ${clickhouseGrantedScope} ON ${bucketName}.* TO ${userAppName}`)

    return {
        status: 'success'
    }
}
