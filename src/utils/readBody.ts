import type { GenericType } from '@gaio/types'
import type { Context } from 'hono'

export const readBody = async (c: Context) => {
    const user = c.get('user')
    const body = await c.req.json()
    return { ...body, user } as GenericType
}
