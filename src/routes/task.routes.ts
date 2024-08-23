import type { Context } from 'hono'
import { Hono } from 'hono'
import jwtGuard from '../middleware/jwt.guard'
import { taskAbort } from '@ModulesCore/task/task.abort'
import { taskListLog } from '@ModulesCore/task/task.list.log'
import { taskRest } from '@ModulesCore/task/task.rest'
import { prepareFlowAndRun } from '@ModulesCore/task/task.runner'
import { getCustomParamValue } from '@ModulesCore/task/task.runner.custom-params'
import { taskStatus } from '@ModulesCore/task/task.status'

const app = new Hono()
    .post('/run', jwtGuard.isAuth, (c: Context) => c.json({}))
    .post('/run-from-here', jwtGuard.isAuth, (c: Context) => c.json({})) // user
    .post('/test-rest', jwtGuard.isAuth, taskRest)
    .post('/run-all', jwtGuard.isAuth, prepareFlowAndRun) // user
    .post('/logs', jwtGuard.isAuth, taskListLog) // def)
    .post('/abort', jwtGuard.isAuth, taskAbort) // dev)
    .get('/status', jwtGuard.isAuth, taskStatus) // dev // stream todo!
    .post('/custom-param', jwtGuard.isAuth, async (c: Context) =>
        c.json(getCustomParamValue((await c.req.json()).params))
    ) // dev

export default app
