import type { GenericType, UserTaskType, UserType } from '@gaio/types'
import { getBucketNameFromAppId } from '@gaio/utils'
import { dbGaio } from '../../../../../db/db.gaio'
import { createTableAtBucket, dropTableIfExist, executeQuery, generateClickhouseColumnTypes } from '../runner.tools'

const openFields = ['userId', 'name', 'email', 'createdAt', 'updatedAt', 'role', 'group']
const types = {
    userId: {
        dataType: 'Nullable(String)',
        columnLength: undefined
    },
    name: {
        dataType: 'Nullable(String)',
        columnLength: undefined
    },
    email: {
        dataType: 'Nullable(String)',
        columnLength: undefined
    },
    createdAt: {
        dataType: 'Nullable(DateTime)',
        columnLength: undefined
    },
    updatedAt: {
        dataType: 'Nullable(DateTime)',
        columnLength: undefined
    },
    role: {
        alias: 'type',
        dataType: 'Nullable(String)',
        columnLength: undefined
    },
    group: {
        dataType: 'Nullable(String)',
        columnLength: undefined
    }
}

export default async <T extends UserTaskType>(taskData: T) => {
    await dropTableIfExist(taskData)

    const fields = taskData.fields.filter((f) => openFields.includes(f))
    await createUserTable(taskData, fields)

    try {
        const groups = (await listAllGroups()) as GenericType[]

        const users = (await listUsers(taskData, fields)) as UserType[]
        return await populateUserTable(taskData, users, fields, groups)
    } catch (e) {
        throw { code: 'error', message: e.message }
    }
}

const createUserTable = async (taskData, fields) => {
    const columns = [
        {
            columnName: 'userId',
            ...types.userId
        }
    ]

    for (const columnName of fields) {
        columns.push({ columnName, ...types[columnName] })
    }

    return await createTableAtBucket(taskData, generateClickhouseColumnTypes({ ...taskData, columns }))
}

const listUsers = async (taskData: UserTaskType, fields) => {
    const prepareFields = fields.map((f) => {
        if (f === 'role' || f === 'type') {
            return `user.role as type`
        } else if (f === 'group') {
            return 'user.tags as tags'
        } else {
            return `user.${f}`
        }
    })

    try {
        return await dbGaio().query(
            `SELECT user.userId, 
                        ${prepareFields.toString()} 
                        FROM user WHERE user.role != 'portal' 
                        AND user.role != 'group' 
                        AND isNotNull(user.email)
                        AND user.email != ''`
        )
    } catch (e) {
        throw { code: 'error', message: "Can't run query on Gaio Admin - " + e.message }
    }
}

const listAllGroups = async () => {
    return await dbGaio().query(
        `SELECT userId, name
                 FROM user
                 WHERE role = 'group'`
    )
}

const populateUserTable = async (
    taskData: UserTaskType,
    users: UserType[],
    fields: string[],
    groups: GenericType[]
) => {
    fields = fields.map((o) => {
        if (o === 'role') {
            return 'type'
        }
        return o
    })

    const willGetGroups = fields.filter((o) => o === 'group').length

    for (const item of users) {
        let baseTags = ''
        if (willGetGroups) {
            baseTags = (item.tags || [])
                .map((o) => groups.find((g) => g.userId === o)?.name || '')
                .filter((o) => o)
                .toString()

            baseTags = baseTags || ''
        }

        await executeQuery({
            at: taskData,
            sql: `insert into ${getBucketNameFromAppId(taskData.appId)}.${
                taskData.resultTable
            } (userId,${fields.toString()}) values(                
                        ${Object.values({
                            ...item,
                            tags: baseTags
                        })
                            .map((o) => (o ? `'${o}'` : "''"))
                            .toString()})`
        })
    }

    return { status: 'done' }
}
