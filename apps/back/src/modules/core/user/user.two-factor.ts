import type { Context } from 'hono'
import { UserModel } from '../../../models'

export const resetTwoFactor = async (c: Context) => {
    const userContext = c.get('user')
    const { userId } = await c.req.json()
    await UserModel.resetTwoFactor(userId, userContext)
    return c.json({
        status: 'done'
    })
}
