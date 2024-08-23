import { type CommonTaskType } from './common.task.type'
import type { GenericType } from '../generic.type'

export type MailTaskType = Partial<{
    extraData: string[]
    sleep: number
    toColumnName: string
    testMail: string
    service: string
    office365: boolean
    host: string
    port: string
    secure: boolean
    user: string
    password: string
    options: GenericType
    from: string
    tableName: string
    resultTable: string
    resultTableTruncate: boolean
    keepLogDays: number
    subject: string
    message: string
    appId: string
    truncateTables: string[]
    dropTables: string[]
}> &
    CommonTaskType
