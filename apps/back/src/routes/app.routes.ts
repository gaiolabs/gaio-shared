import { appDelete } from '@ModulesCore/app/app.delete'
import { appInit } from '@ModulesCore/app/app.init'
import { appList } from '@ModulesCore/app/app.list'
import { appSave } from '@ModulesCore/app/app.save'
import { updateAppForms } from '@ModulesCore/app/app.update-forms'
import { updateAppOptions } from '@ModulesCore/app/app.update-options'
import { updateAppParams } from '@ModulesCore/app/app.update-params'
import { flowRenewFlowKey } from '@ModulesCore/flow/flow.renew-flow-key'
import { readBody } from '@Utils/readBody'
import { Hono } from 'hono'
import type { Context } from 'hono'
import jwtGuard from '../middleware/jwt.guard'

const app = new Hono()
    .post('/init', jwtGuard.isAuth, async (c: Context) => {
        const { appId, user } = await readBody(c)
        return c.json(appInit(appId, user))
    })

    .post('/save', jwtGuard.isAuth, async (c: Context) => {
        const { app, user } = await readBody(c)
        return c.json(appSave(app, user))
    })

    .post('/list', jwtGuard.isAuth, async (c: Context) => {
        const { appIds, user } = await readBody(c)
        return c.json(appList(appIds, user))
    })

    .post('/renew-flow-key', jwtGuard.isAuth, async (c: Context) => {
        const { flowId, appId, user } = await readBody(c)
        return c.json(flowRenewFlowKey(flowId, appId, user))
    })

    .post('/update-options', jwtGuard.isAuth, async (c: Context) => {
        const { app, user } = await readBody(c)
        return c.json(updateAppOptions(app, user))
    })

    .post('/update-params', jwtGuard.isAuth, async (c: Context) => {
        const { app, user } = await readBody(c)
        return c.json(updateAppParams(app, user))
    })

    .post('/update-forms', jwtGuard.isAuth, async (c: Context) => {
        const { app, user } = await readBody(c)
        return c.json(updateAppForms(app, user))
    })

    .post('/delete', jwtGuard.isAuth, async (c: Context) => {
        const { app } = await readBody(c)
        return c.json(appDelete(app))
    })

export default app
