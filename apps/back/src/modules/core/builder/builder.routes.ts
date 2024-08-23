import { QueryBuilder } from './builder'
import { guard } from '../../../utils'

export default (app) => {
    app.post(
        '/api/builder/sql',
        async ({ body }) => {
            try {
                return { query: await new QueryBuilder().generate(body.taskData, body.params) }
            } catch (e) {
                return { error: true, message: e.message, query: '' }
            }
        },
        {
            beforeHandle: guard('dev')
        }
    )
}
