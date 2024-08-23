import type { TagType, UserType, UserOptionsType } from '@gaio/types'
import { SerialModel } from './index'

import { dbGaio } from '../db/db.gaio'
import { throwError } from '../utils'

/**
 * @desc create a new user
 * @param userData
 */
const createUser = async (userData: UserType) => {
    const verifyUserExists = await getUserByEmail(userData.email)

    // if the user already exists, throw an error
    if (verifyUserExists) {
        return throwError({
            code: 400,
            message: 'user already exists'
        })
    }

    const userId = 'user:' + (await SerialModel.getUserSerial())

    await dbGaio().exec(
        `INSERT INTO user (
                    userId,
                    name,
                    email,
                    password,
                    role,
                    status,
                    options,
                    tags,
                    lang
        ) VALUES (
            {userId: String},
            {name: String}, 
            {email: String}, 
            {password: String}, 
            {role: String}, 
            {status: String}, 
            {options: String},
            {tags: String},
            {lang: String}
        )`,
        {
            params: {
                userId,
                name: userData.name,
                email: userData.email,
                password: userData.password,
                role: userData.role,
                status: 'active',
                lang: userData.lang || 'en-US',
                options: userData.options || {},
                tags: userData.tags || []
            },
            stringify: ['options', 'tags']
        }
    )

    // hash the password
    // const data = {
    // ...userData,
    // password: userData.password // Bun.password.hashSync(userData.password, 'bcrypt')
    // }

    return {}
}

/**
 * @desc get user by username
 * @param email
 */
const getUserByEmail = async (email: string) => {
    return await dbGaio()
        .query(
            `SELECT * FROM user 
                    WHERE email = {email: String}
                     AND deleted = 0 
                    LIMIT 1`,
            {
                params: {
                    email
                },
                parse: ['options']
            }
        )
        .then((res) => res[0])
}

/**
 * @desc get user by id
 * @param userId
 */
const getUserById = async (userId: string): Promise<UserType> => {
    return (await dbGaio()
        .query(
            `SELECT * FROM user 
                    WHERE userId = {userId: String} 
                    AND deleted = 0`,
            {
                params: {
                    userId
                },
                parse: ['options']
            }
        )
        .then((res) => res[0])) as UserType
}

const getUserAppTags = async (userId: string) => {
    return await dbGaio().query<TagType>(`SELECT * FROM tags where userId = {userId: String} AND type = 'app'`, {
        params: {
            userId
        },
        parse: ['options']
    })
}

const mergeUserMetadata = async (userData: UserType) => {
    return await dbGaio().exec(
        `ALTER TABLE user
            UPDATE  name = {name: String},
                    email = {email: String}, 
                    lang = {lang: String}
            WHERE userId = {userId: String}`,
        {
            params: userData
        }
    )
}

const updateUserData = async (userData: UserType, userContext: UserType) => {
    return await dbGaio().exec(
        `ALTER TABLE user
            UPDATE  name = {name: String},
                    email = {email: String},
                    role = {role: String},
                    status = {status: String}, 
                    lang = {lang: String},
                    modifiedBy = {modifiedBy: String},
                    updatedAt = now()
            WHERE userId = {userId: String}`,
        {
            params: {
                ...userData,
                modifiedBy: userContext.userId
            }
        }
    )
}

const updatePassword = async ({ password, userId }) => {
    return await dbGaio().exec(
        `ALTER TABLE user
            UPDATE  password = {password: String}
            WHERE userId = {userId: String}`,
        {
            params: {
                password,
                userId
            }
        }
    )
}

const mergeUserOptions = async (userId: string, options: UserOptionsType) => {
    return await dbGaio().exec(
        `ALTER TABLE user
            UPDATE options = {options: String}
            WHERE userId = {userId: String}`,
        {
            params: {
                options,
                userId
            },
            stringify: ['options']
        }
    )
}

const emailExist = async (email: string) => {
    return await dbGaio().query(`SELECT email, deleted FROM user WHERE email = {email: String}`, {
        params: {
            email
        }
    })
}

const getAllUsersAndGroups = async () => {
    return await dbGaio()
        .query(
            `SELECT * FROM user WHERE role != 'portal' 
                    AND deleted = 0
                    ORDER BY name, userId`,
            {
                parse: ['options']
            }
        )
        .then((res) =>
            res.map((user) => {
                delete user.password
                return user
            })
        )
}

const deleteUser = async (userId: string, userContext: UserType) => {
    const user = await dbGaio().query(
        `SELECT role
            FROM user
            WHERE userId = {userId: String}`,
        { params: { userId } }
    )

    if (user[0]?.role !== 'admin') {
        await dbGaio().exec(
            `ALTER TABLE user
                UPDATE deleted = 1,
                        modifiedBy = {modifiedBy: String},
                        updatedAt = now()
                WHERE userId = {userId: String}`,
            { params: { userId, modifiedBy: userContext.userId } }
        )
    }

    return { status: 'done' }
}

const resetTwoFactor = async (userId: string, userContext: UserType) => {
    return await dbGaio().exec(
        `ALTER TABLE user
            UPDATE twoFactorKey = null,
                twoFactorSigned = 'no',
                twoFactorStatus = 'invalid',
                updatedAt = now(),
                modifiedBy = {modifiedBy: String}
            WHERE userId = {userId: String}`,
        {
            params: {
                userId,
                modifiedBy: userContext.userId
            }
        }
    )
}

const getUsersByTagRefAndType = async (ref: string, type: string) => {
    return await dbGaio().query(
        `SELECT user.userId, user.name, user.email, 'user' as type, user.role, lang
            FROM user
            INNER JOIN tag ON tag.userId = user.userId
            WHERE tag.refId = {ref: String}
            AND tag.type = {type: String}
            AND user.deleted = 0`,
        {
            params: {
                ref,
                type
            }
        }
    )
}

const getUsersToTagControl = async (userId?: string) => {
    const fields = ['userId', 'name', 'email', 'role', 'options', 'lang', `'user' AS type`]

    if (userId) {
        return await dbGaio().query(
            `SELECT 
                ${fields.join(',')}
            FROM user 
            WHERE role  != 'portal' 
                AND deleted = 0
                AND userId = {userId: String}
            ORDER BY name, userId`,
            {
                params: { userId },
                parse: ['options']
            }
        )
    }
    return await dbGaio().query(
        `SELECT
            ${fields.join(',')}
            FROM user 
            WHERE role  != 'portal' 
                AND deleted = 0
            ORDER BY name, userId`,
        {
            parse: ['options']
        }
    )
}

const deleteGroup = async (userId: string) => {
    const usersInGroup = (await dbGaio().query(
        `SELECT userId, tags 
                FROM user 
                WHERE  has(tags, {userId: String}) = 1`,
        {
            params: { userId },
            parse: ['tags']
        }
    )) as UserType[]

    await Promise.all(
        usersInGroup.map(async (user) => {
            return dbGaio().exec(
                `ALTER TABLE user 
                        UPDATE tags = {tags: Array<Nullable(String)>} 
                        WHERE userId = {userId: String}`,
                {
                    params: {
                        tags: user.tags.filter((tag) => tag !== userId).join(','),
                        userId: user.userId
                    }
                }
            )
        })
    )

    await dbGaio('deleteUserGroup').exec(
        `ALTER TABLE user
            DELETE where userId = {userId: String}`,
        { params: { userId } }
    )
}

const saveGroup = async (userData: UserType, userContext: UserType) => {
    if (userData.userId) {
        return await dbGaio().exec(
            `ALTER TABLE user
                UPDATE  name = {name: String},
                        options = {options: String},
                        modifiedBy = {modifiedBy: String},
                        updatedAt = now()
                WHERE userId = {userId: String}`,
            {
                params: {
                    name: userData.name,
                    options: userData.options,
                    userId: userData.userId,
                    modifiedBy: userContext.userId
                },
                stringify: ['options']
            }
        )
    } else {
        const userId = 'user:' + (await SerialModel.getUserSerial())

        await dbGaio().exec(
            `INSERT INTO user (userId, name, role, options) VALUES (
                                {userId: String},
                                {name: String}, 
                                {role: String}, 
                                {options: String})`,
            {
                params: {
                    userId,
                    name: userData.name,
                    role: 'group',
                    status: 'active',
                    options: userData.options || {}
                },
                stringify: ['options']
            }
        )
    }
}

export default {
    saveGroup,
    createUser,
    deleteUser,
    emailExist,
    getUserById,
    deleteGroup,
    getUserByEmail,
    resetTwoFactor,
    updatePassword,
    updateUserData,
    getUserAppTags,
    mergeUserOptions,
    mergeUserMetadata,
    getUsersToTagControl,
    getAllUsersAndGroups,
    getUsersByTagRefAndType
}
