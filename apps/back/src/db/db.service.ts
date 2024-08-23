import type { CommonTaskType, ConnectionResultType } from '@gaio/types'
import { getBucketNameFromAppId } from '@gaio/utils'
import { dbConfig } from './db.config'
import { dbHub } from './db.hub'
import { RepoModel, SourceModel } from '../models'

export class DbService {
    public async connect(taskData: CommonTaskType): Promise<{
        query: (sql: string, args?: unknown[]) => Promise<ConnectionResultType>
    }> {
        return {
            query: async (sql: string, args: unknown[] = []): Promise<ConnectionResultType> => {
                console.log('remove this, arg', args)
                const connection = await this.createConnection(taskData)

                if (connection) {
                    try {
                        return (await connection['query'](sql)) as ConnectionResultType
                    } catch (e) {
                        return {
                            error: true,
                            message: e.message
                        }
                    }
                }

                return new Promise((resolve) => resolve({}))
            }
        }
    }

    private async createConnection(taskData: CommonTaskType) {
        const connectionName = DbService.connectionName(taskData)

        if (!dbConfig.hasOwnProperty(connectionName)) {
            dbConfig[connectionName] = await this.prepareConnection(taskData)
        }

        return dbConfig[connectionName]
    }

    private async prepareConnection(taskData: CommonTaskType): Promise<{ query: (sql: string) => Promise<unknown> }> {
        const credentials = await this.getCredentials(taskData)

        if (credentials) {
            return await this.defineResultByDriver(credentials.client, dbHub(credentials))
        }

        throw new Error('No credentials')
    }

    private async getCredentials(taskData: CommonTaskType) {
        return taskData.sourceType === 'bucket' ?
                await RepoModel.getRepoCredentials(taskData)
            :   await SourceModel.getSourceCredentials(taskData.sourceId)
    }

    private static connectionName(taskData: CommonTaskType) {
        switch (taskData.sourceType) {
            case 'source':
                return 'database_' + taskData.sourceId.replace('source:', '')
            default:
                // need fix typing, sometimes we use this.... admin prop
                if (taskData['admin']) {
                    return getBucketNameFromAppId(taskData.appId as string) + '_admin'
                }
                return getBucketNameFromAppId(taskData.appId as string)
        }
    }

    private async defineResultByDriver(client: string, conn) {
        if (client === 'mysql') {
            return {
                query: async (sql: string) => {
                    return await conn.then((myConn) => myConn.query(sql).then(([data, meta]) => ({ data, meta })))
                }
            }
        }
        return conn
    }
}
