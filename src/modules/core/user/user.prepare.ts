import type { Context } from 'hono'

export const userPrepare = async (c: Context) => {
    return c.json({})
}
