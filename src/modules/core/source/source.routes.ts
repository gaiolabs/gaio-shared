import { deleteSource, getSourceDataById, listSources, upsertSource } from './source.manager'
import { guardLevel } from '../../../utils'

export default (app) => {
    app.group('/api/source', (route) =>
        route
            .get('/data/:sourceId', async ({ params }) => getSourceDataById(params.sourceId), guardLevel('admin'))
            .get('/list', async () => listSources(), guardLevel('admin'))
            .post('/remove', async ({ body }) => deleteSource(body.sourceId), guardLevel('admin'))
            .post('/save', async ({ body, user }) => await upsertSource(body.sourceData, user), guardLevel('admin'))
    )
}
