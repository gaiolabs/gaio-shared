// import { deleteRepo, getListOfRepo, getRepoDataById, upsertRepo } from './repo.manager'
// import { RepoModel } from '../../../models'
// import { guardLevel } from '../../../utils'

// export default (app) => {
//     app.group('/api/repo', (route) =>
//         route
//             .get('/data/:repoId', async ({ params }) => await getRepoDataById(params.repoId), guardLevel('admin'))
//             .get('/list', async () => getListOfRepo(), guardLevel('admin'))
//             .post('/save', async ({ body, user }) => upsertRepo(body.repoData, user), guardLevel('admin'))
//             .post('/delete', async ({ body }) => deleteRepo(body.repoId), guardLevel('admin'))
//             .post('/list-details', async () => await RepoModel.getListOfRepo(), guardLevel('admin'))
//     )
// }
