import type { UserLoginType } from '@gaio/types'
import { signIn } from '@ModulesCore/auth/auth.signin'
import type { Context } from 'hono'
import { Hono } from 'hono'

const app = new Hono().post('/sign-in', async (c: Context) => {
    const body: UserLoginType = await c.req.json()
    const { email, password } = body
    const resultData = await signIn(email, password)
    return c.json(resultData)
})

export default app
