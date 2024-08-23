import type { ParamType } from '@gaio/types'
import type { Context } from 'hono'
import { Hono } from 'hono'
import jwtGuard from '../middleware/jwt.guard'
import { QueryBuilder } from '@ModulesCore/builder/builder'

const app = new Hono().post('/sql', jwtGuard.isAuth, async (c: Context) => {
    try {
        const { taskData, params } = await c.req.json<{ taskData: unknown; params: ParamType[] }>()

        return c.json({ query: await new QueryBuilder().generate(taskData, params) })
    } catch (e) {
        return c.json({ error: true, message: e.message, query: '' })
    }
})

export default app
