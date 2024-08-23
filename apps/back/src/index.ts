import { cors } from '@elysiajs/cors'
import { jwt } from '@elysiajs/jwt'
import { staticPlugin } from '@elysiajs/static'
import type { UserType } from '@gaio/types'
import { Elysia } from 'elysia'

import appRoutes from './modules/core/app/app.routes'
import baseRoutes from './modules/core/base/base.routes'
import builderRoutes from './modules/core/builder/builder.routes'
import commanderRoutes from './modules/core/commander/commander.routes'
import discoveryRoutes from './modules/core/discovery/discovery.routes'
// import flowRoutes from './modules/core/flow/flow.routes'
import repoRoutes from './modules/core/repo/repo.routes'
import settingsRoutes from './modules/core/settings/settings.routes'
import sourceRoutes from './modules/core/source/source.routes'
import tableRoutes from './modules/core/table/table.routes'
import taskRoutes from './modules/core/task/task.routes'
import userRoutes from './modules/core/user/user.routes'

const app = new Elysia()
    .decorate({
        user: {} as UserType
    })
    .use(
        jwt({
            name: 'jwt',
            secret: 'secret'
        })
    )
    .use(cors())
    .use(staticPlugin())

appRoutes(app)
// flowRoutes(app)
userRoutes(app)
taskRoutes(app)
repoRoutes(app)
baseRoutes(app)
tableRoutes(app)
sourceRoutes(app)
builderRoutes(app)
commanderRoutes(app)
settingsRoutes(app)
discoveryRoutes(app)

// const a = [{ id: 'fafdas', name: '{"id":"ajonas","name":"amigo \\"\\" <script><script> \' @#$%ˆ&*!(){}\\\\ sdf"}' }];

//
//
// console.log(await dbGaio().query('select * from app'));
// console.log(
// await dbGaio().insert('pass', [
//     {
//         appId: 'app:1353',
//         password: 'sogowodog',
//         repoId: 'repo:sdor4y5q2idat9spsbij',
//         sees: []
//     }
// ]);
// );
//

app.listen(3000)

console.log('server listening at port http://localhost:3000')
