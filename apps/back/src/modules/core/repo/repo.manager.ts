import type { SourceType, UserType } from '@gaio/types'
import { getId } from '@gaio/utils'
import type { Context } from 'hono'
import { RepoModel } from '../../../models'

export const getListOfRepo = async (c: Context) => {
    console.log()
    return c.json(
        RepoModel.getListOfRepo().then((res) => {
            return res.map((o) => {
                delete o.credentials.password
                return o
            })
        })
    )
}

export const getRepoDataById = async (c: Context) => {
    const sourceId: string = await c.req.json()
    return c.json(
        RepoModel.getRepoDataById(sourceId).then((res) => {
            delete res.password
            return res
        })
    )
}

export const deleteRepo = async (c: Context) => {
    const repoId: string = await c.req.json()
    await RepoModel.deleteRepository(repoId)
    return c.json({
        status: 'done'
    })
}

export const upsertRepo = async (c: Context) => {
    const userContext: UserType = c.get('user')
    const repoData: SourceType = await c.req.json()
    if (repoData.repoId) {
        await RepoModel.saveRepo(repoData, userContext)
    } else {
        const repoId = getId()
        await RepoModel.createRepo(
            {
                repoId,
                repoName: repoData.repoName,
                credentials: repoData.credentials,
                createdBy: userContext.userId,
                modifiedBy: userContext.userId
            },
            userContext
        )
    }

    return c.json({
        status: 'done'
    })
}
