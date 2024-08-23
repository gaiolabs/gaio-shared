import type { AppType, SourceType, UserType } from '@gaio/types'
import { getBucketNameFromAppId } from '@gaio/utils'
import { AppModel, FlowModel, PassModel, SourceModel } from '../../../models'

const generateBucketSourceData = async (app: Partial<AppType>, user: UserType) => {
    const sourceList = (await SourceModel.getSourceByUser(user)) as SourceType[]
    const bucketAccess = await PassModel.getListOfAppsBucketHasAccess(app.appId)

    const sourceBase = [
        {
            client: 'clickhouse',
            repoId: app.repoId,
            sourceType: 'bucket',
            sourceName: getBucketNameFromAppId(app.appId),
            databaseName: getBucketNameFromAppId(app.appId)
        }
    ] as SourceType[]

    for (const sharedAppId of bucketAccess as string[]) {
        sourceBase.push({
            client: 'clickhouse',
            repoId: app.repoId,
            sourceType: 'bucket',
            sourceName: getBucketNameFromAppId(sharedAppId),
            databaseName: getBucketNameFromAppId(sharedAppId)
        })
    }

    return sourceBase.concat(sourceList)
}

export const appInit = async (appId: string, user: UserType) => {
    const app = (await AppModel.getSingleAppById(appId)) as Partial<AppType>
    const flowList = await FlowModel.getFlowListByAppId(appId)
    const sourceList = await generateBucketSourceData(app, user)

    return {
        app,
        flowList,
        sourceList
    }
}
