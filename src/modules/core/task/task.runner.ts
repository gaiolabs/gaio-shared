import type {
    FlowType,
    GenericType,
    NodeType,
    ParamType,
    TaskContextType,
    TaskJobType,
    TaskLogType,
    UserType
} from '@gaio/types'
import { executables } from '@gaio/utils'
import type { Context } from 'hono'
import { cloneDeep } from 'lodash-es'
import runnerTriage from './runners/runner.triage'
import { untilRules } from './task.runner.until-rules'
import { dbGaio } from '../../../db/db.gaio'
import { gaioRedis } from '../../../db/gaioRedis'
import { TaskLogModel } from '../../../models'

type BodyType = {
    from: string
    meta: {
        appId: string
        flowId: string
    }
    params: ParamType[]
    tasks: GenericType[]
}

const updateTaskLogAndPublish = async (
    taskLog: TaskLogType,
    taskJob: TaskJobType,
    taskJobItems: Record<string, TaskJobType>
) => {
    taskJobItems[taskLog.taskLogId] = taskJob
    await TaskLogModel.updateSingleTaskLog(taskLog.taskLogId, taskJobItems)
    await gaioRedis.pub.publish(
        `${taskLog.appId}-${taskLog.userId}`,
        JSON.stringify({
            ...taskLog,
            taskData: taskJob
        })
    )
}

const observeAndAbortRunner = (controller: AbortController) => {
    if (controller?.signal?.aborted === true) {
        return 'break'
    }
    return 'ok'
}

// const monitorTaskForTermination = (taskLog: TaskLogType, controller: AbortController) => {
// TaskLogModel.liveSelectByTaskLogId(taskLog.id).then(async (res) => {
//     console.log('res', res);
//     if (res[0]) {
//         await dbAdmin().listenLive(res[0] as string, () => {
//             controller.abort({ status: 'aborted' });
//         });
//     }
// });
// }

export const prepareFlowAndRun = async (c: Context) => {
    const body = await c.req.json()

    const user: UserType = c.get('user')
    const taskContext: TaskContextType = {
        userId: user.userId,
        from: body.from || 'studio',
        userStatus: user.status,
        userRole: user.role,
        sessionid: user.sessionid,
        appId: body.meta.appId,
        flowId: body.meta.flowId
    }

    body.tasks = await dbGaio()
        .query('SELECT workflow FROM flow WHERE flowId = {flowId: String} AND appId = {appId: String}', {
            params: {
                flowId: body.meta.flowId,
                appId: body.meta.appId
            },
            parse: ['workflow']
        })
        .then((res) => {
            if (res && res[0] && res[0].workflow) {
                return res[0].workflow.nodes.filter((o: NodeType) => executables.includes(o.type))
            }
            return []
        })

    if (body.tasks && body.tasks.length > 0) {
        // await this.defineFlowTimeout(body.appId, user.userId, body.flowTimeout, body.flowId);
        return c.json(await taskRunner(body, taskContext))
    } else {
        return c.json({ status: 'done', message: 'No task to run' })
    }
}

export const taskRunner = async (body: BodyType, taskContext: TaskContextType) => {
    const controller = new AbortController()
    const taskLog = await TaskLogModel.createTaskLog(body.meta, { userId: taskContext.userId } as UserType)
    const taskJobItems = {}

    // monitorTaskForTermination(taskLog, controller)

    try {
        let index = 0
        for await (const taskData of body.tasks) {
            untilRules(taskData, body.params)

            if (taskData.stopped) {
                break
            }

            if (taskData.paused) {
                continue
            }

            const taskJob: TaskJobType = {
                userId: taskContext.userId as string,
                taskId: taskData.id as string,
                flowId: body.meta.flowId,
                status: 'started',
                startedAt: new Date().toISOString(),
                endedAt: new Date().toISOString()
            }

            try {
                await updateTaskLogAndPublish(taskLog, taskJob, taskJobItems)

                let abort = observeAndAbortRunner(controller)
                if (abort === 'break') {
                    break
                }

                // * TASK WILL BE CALLED HERE * //
                // await sleep(1000)
                await Bun.sleep(1000)
                // if (taskData.type === 'flow') {
                //     const runFlowTaskBody: BodyType = cloneDeep(body)
                //     runFlowTaskBody.meta.flowId = taskData.flowId as string
                //
                //     await prepareFlowAndRun(runFlowTaskBody, taskContext)
                // } else {
                //     await runnerTriage(taskData, body.params, taskContext)
                // }
                // * TASK WILL BE CALLED HERE * //
                taskJob.status = 'ended'
                taskJob.endedAt = new Date().toISOString()
                taskLog.status = index >= body.tasks.length - 1 ? 'ended' : 'started'

                await updateTaskLogAndPublish(taskLog, taskJob, taskJobItems)

                abort = observeAndAbortRunner(controller)
                if (abort === 'break') {
                    break
                }

                index++
            } catch (e) {
                taskJob.status = 'error'
                taskJob.endedAt = new Date().toISOString()
                taskJob.message = e.message

                taskLog.status = index >= body.tasks.length - 1 ? 'ended' : 'started'

                await updateTaskLogAndPublish(taskLog, taskJob, taskJobItems)

                index++

                if (taskData.stopOnError) {
                    break
                }

                return {
                    status: 'finished',
                    error: true,
                    message: e.message,
                    aborted: controller.signal?.aborted,
                    params: body.params
                }
            }
        }
        return {
            status: 'finished',
            error: false,
            message: 'finished',
            aborted: controller.signal?.aborted,
            params: body.params
        }
    } catch (e) {
        return {
            status: 'finished',
            error: true,
            message: e.message,
            aborted: controller.signal?.aborted,
            params: body.params
        }
    } finally {
        await TaskLogModel.finalizeTaskLog(taskLog.taskLogId, 'ended')
        await gaioRedis.pub.publish(
            taskLog.appId,
            JSON.stringify({
                ...taskLog,
                aborted: controller.signal?.aborted,
                status: 'ended',
                endedAt: new Date()
            })
        )
    }
}
