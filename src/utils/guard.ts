import type { UserType } from '@gaio/types'
import { throwError } from './throwError'

const userRoleType = {
    admin: ['user', 'dev', 'admin'],
    dev: ['dev', 'user'],
    user: ['user']
}

const notAuthorized = () => {
    throwError({
        statusCode: 401,
        statusMessage: 'not authorized'
    })
}

export const guardLevel = (level) => {
    return {
        beforeHandle: guard(level)
    }
}

export const guard = (routeRoleType: string) => {
    return async (context) => {
        const { jwt, headers, query } = context

        let authorization = headers['authorization']

        if (!authorization) {
            if (query['gaioToken']) {
                authorization = 'Bearer ' + query['gaioToken']
            } else {
                notAuthorized()
            }
        }

        try {
            const token = authorization.split(' ')[1]
            if (!token) notAuthorized()

            const decoded = (await jwt.verify(token)) as UserType & boolean
            if (!decoded) notAuthorized()
            if (!decoded?.userId) notAuthorized()

            if (!userRoleType[decoded.role]) notAuthorized()
            if (userRoleType[decoded.role].indexOf(routeRoleType) === -1) notAuthorized()

            context.user = decoded
            context.appId = query['appId']
        } catch (err) {
            return notAuthorized()
        }
    }
}
