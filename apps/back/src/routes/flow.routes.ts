import { Hono } from 'hono'
import jwtGuard from '../middleware/jwt.guard'
import { flowClone } from '@ModulesCore/flow/flow.clone'
import { flowDelete } from '@ModulesCore/flow/flow.delete'
import { flowList } from '@ModulesCore/flow/flow.list'
import { flowRenewFlowKey } from '@ModulesCore/flow/flow.renew-flow-key'
import { flowSave } from '@ModulesCore/flow/flow.save'
import { flowUpdateOrder } from '@ModulesCore/flow/flow.update-order'

const app = new Hono()
    .post('/save', jwtGuard.isAuth, flowSave)
    .post('/list', jwtGuard.isAuth, flowList)
    .post('/remove', jwtGuard.isAuth, flowDelete)
    .post('/clone', jwtGuard.isAuth, flowClone)
    .post('/renew-flow-key', jwtGuard.isAuth, flowRenewFlowKey)
    .post('/update-order', jwtGuard.isAuth, flowUpdateOrder)
export default app
