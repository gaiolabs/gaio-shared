import type { TaskContextType } from '@gaio/types'
import { taskAbort } from './task.abort'
import { taskListLog } from './task.list.log'
import { taskRest } from './task.rest'
import { prepareFlowAndRun } from './task.runner'
import { getCustomParamValue } from './task.runner.custom-params'
import { taskStatus } from './task.status'
import { guardLevel } from '../../../utils'

export default (app) => {
    app.group('/api/task', (route) =>
        route
            .post('/run', async ({ body }) => body, guardLevel('user'))
            .post('/test-rest', async ({ body }) => taskRest(body), guardLevel('user'))
            .post('/run-from-here', async ({ body }) => body, guardLevel('user'))
            .post(
                '/run-all',
                async ({ user, body }) => {
                    const taskContext: TaskContextType = {
                        userId: user.userId,
                        from: body.from || 'studio',
                        userStatus: user.status,
                        userRole: user.role,
                        sessionid: user.sessionid,
                        appId: body.meta.appId,
                        flowId: body.meta.flowId
                    }
                    return await prepareFlowAndRun(body, taskContext)
                },
                guardLevel('user')
            )
            .post('/logs', async ({ body, user }) => await taskListLog(body, user), guardLevel('dev'))
            .post('/abort', async ({ body }) => await taskAbort(body), guardLevel('dev'))
            .get('/status', ({ query, user }) => taskStatus(query, user, route), guardLevel('dev'))
            .post('/custom-param', async ({ body }) => await getCustomParamValue(body.params), guardLevel('dev'))
    )
}
