import type { TaskJobType, TaskLogType, UserType } from '@gaio/types'
import { getId } from '@gaio/utils'
import { dbGaio } from '../db/db.gaio'

const date = Date.now()

const createTaskLog = async (
    { appId, flowId }: { [key: string]: unknown },
    { userId }: Partial<UserType>
): Promise<TaskLogType> => {
    const taskLogId = getId()
    await dbGaio('insertTaskLog').insert('taskLog', [
        {
            taskLogId,
            tasks: {},
            flowId,
            aborted: false,
            userId: userId,
            appId: appId,
            status: 'started',
            startedAt: date,
            endedAt: date
        }
    ])
    return await findTaskLog(taskLogId)
}

const findTaskLog = async (taskLogId: string): Promise<TaskLogType> => {
    return await dbGaio('listTaskLog')
        .query(`SELECT * FROM task_log WHERE taskLogId = {taskLogId: String}`, {
            params: { taskLogId }
        })
        .then((res) => res[0] as TaskLogType)
}

const finalizeTaskLog = async (taskLogId: string, status: string) => {
    await dbGaio('finalizeTaskLogStatus').exec(
        `ALTER TABLE task_log
            UPDATE status = {status: String}, endedAt = {endedAt: Datetime}
            WHERE taskLogId = {taskLogId: String}`,
        {
            params: {
                status,
                taskLogId,
                endedAt: date
            }
        }
    )
}

const updateTaskLogStopProp = async (taskLogId: string) => {
    await dbGaio('updateTaskLogStatus').exec(
        `ALTER TABLE task_log
            UPDATE status = {status: String}, endedAt = {endedAt: Datetime}
            WHERE taskLogId = {taskLogId: String}`,
        {
            params: {
                aborted: true,
                taskLogId
            }
        }
    )
}

const getLogsListByAppId = async (appId: string, userId?: string | number) => {
    if (userId) {
        return await dbGaio('listTaskLogByUserAndApp').query(
            `SELECT * 
                FROM task_log 
                WHERE appId = {appId: String} AND userId = {userId: String}
                ORDER BY startedAt DESC LIMIT 10`,
            {
                params: {
                    appId,
                    userId
                },
                parse: ['tasks']
            }
        )
    }

    return await dbGaio('listAllTaskLogByApp').query(
        `SELECT * FROM task_log WHERE appId = {appId: String} ORDER BY startedAt DESC LIMIT 10`,
        {
            params: { appId }
        }
    )
}

const updateSingleTaskLog = async (taskLogId: string, taskJobItems: Record<string, TaskJobType>) => {
    await dbGaio('updateTaskLogData').exec(
        `ALTER TABLE task_log
            UPDATE tasks = {tasks: String}
            WHERE taskLogId = {taskLogId: String}`,
        {
            params: {
                tasks: taskJobItems,
                taskLogId
            },
            stringify: ['tasks']
        }
    )
}

const deleteTaskLogByAppId = async (appId: string) => {
    return await dbGaio('deleteTaskLogByApp').exec(`DELETE FROM task_log WHERE appId = {appId: String}`, {
        params: {
            appId
        }
    })
}

export default {
    updateTaskLogStopProp,
    deleteTaskLogByAppId,
    getLogsListByAppId,
    updateSingleTaskLog,
    finalizeTaskLog,
    createTaskLog
}
