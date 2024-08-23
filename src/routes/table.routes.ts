import { Hono } from 'hono'
import jwtGuard from '../middleware/jwt.guard'
import { tableHistogram } from '@ModulesCore/table/table-histogram'
import { tableCount } from '@ModulesCore/table/table.count'
import { tableDescribe } from '@ModulesCore/table/table.describe'
import { tableDistinct } from '@ModulesCore/table/table.distinct'
import { tableEmpty } from '@ModulesCore/table/table.empty'
import { tableFields } from '@ModulesCore/table/table.fields'
import { tableFrequency } from '@ModulesCore/table/table.frequency'
import { tableList } from '@ModulesCore/table/table.list'
import { tableMinMax } from '@ModulesCore/table/table.min.max'
import { tableReport } from '@ModulesCore/table/table.report'
import { tableRows } from '@ModulesCore/table/table.rows'
import { tableStats } from '@ModulesCore/table/table.stats'

const app = new Hono()
    .post('/field', jwtGuard.isAuth, tableFields)
    .post('/describe', jwtGuard.isAuth, tableDescribe)
    .post('/frequency', jwtGuard.isAuth, tableFrequency)
    .post('/rows', jwtGuard.isAuth, tableRows)
    .post('/list', jwtGuard.isAuth, tableList)
    .post('/count', jwtGuard.isAuth, tableCount)
    .post('/stats', jwtGuard.isAuth, tableStats)
    .post('/empty', jwtGuard.isAuth, tableEmpty)
    .post('/count-distinct', jwtGuard.isAuth, tableDistinct)
    .post('/min-max', jwtGuard.isAuth, tableMinMax)
    .post('/histogram', jwtGuard.isAuth, tableHistogram)
    .post('/report', jwtGuard.isAuth, tableReport)

export default app
