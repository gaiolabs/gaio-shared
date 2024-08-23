import type { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { verify } from 'hono/jwt'

function throw_err(msg: string, code: number) {
    const err = new Error(msg)

    throw {
        message: err.message,
        statusCode: code
    }
}

const guardLevel = (level) => {
    return {
        isAuth: async (c: Context, next: Next) => {
            try {
                const headerToken = c.req.header('Authorization') || ''
                if (!headerToken) throw_err('Make sure to use the Authorization header', 401)

                const jwt = headerToken.split(' ')[1]
                if (!jwt) throw_err('Use Bearer Authorization', 401)

                // * verify token
                const tokenData = await verify(jwt, process.env.SECRET_KEY || 'secret')
                if (!tokenData) throw_err('Token Invalid', 401)

                console.log('tokenData', tokenData)

                // * set token payload to context for further use
                c.set('user', { userId: 'claebe' })
                c.set('tokenPayload', tokenData)
            } catch (e) {
                throw new HTTPException(e.statusCode, { message: e.message, cause: e })
            }
            await next()
        }
    }
}

export default {
    isAuth: async (c: Context, next: Next) => {
        try {
            const headerToken = c.req.header('Authorization') || ''
            if (!headerToken) throw_err('Make sure to use the Authorization header', 401)

            const jwt = headerToken.split(' ')[1]
            if (!jwt) throw_err('Use Bearer Authorization', 401)

            // * verify token
            const tokenData = await verify(jwt, process.env.SECRET_KEY || 'secret')
            if (!tokenData) throw_err('Token Invalid', 401)

            console.log('tokenData', tokenData)

            // * set token payload to context for further use
            c.set('user', { userId: 'claebe' })
            c.set('tokenPayload', tokenData)
        } catch (e) {
            throw new HTTPException(e.statusCode, { message: e.message, cause: e })
        }
        await next()
    }
}
