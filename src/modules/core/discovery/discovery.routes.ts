import { listDiscovery, saveMeta, updateHits } from './discovery.core'
import { listPowerReferences } from './discovery.power'
import { guardLevel } from '../../../utils'

export default (app) => {
    app.group('/api/discovery', (route) => {
        route
        // .post('/list', ({ body }) => listDiscovery(body), guardLevel('user'))
        // .post('/update-hits', ({ body, user }) => updateHits(body, user), guardLevel('user'))
        // .post('/save-meta', ({ body, user }) => saveMeta(body, user), guardLevel('dev'))
        // .get('/list-power', ({ user }) => listPowerReferences(user), guardLevel('user'))

        return route
    })
}
