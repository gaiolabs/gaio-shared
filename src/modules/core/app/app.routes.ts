export default (app) => {
    app.group(
        '/api/app',
        (route) => route
        // .post('/init', ({ body, user }) => appInit(body as Partial<AppType>, user), guardLevel('dev'))
        // .post('/list', ({ body, user }) => appList(body.appList, user), guardLevel('dev'))
        // .post('/save', ({ body, user }) => appSave(body.app, user), guardLevel('dev'))
        // .post(
        //     '/renew-flow-key',
        //     async ({ body, user }) => await flowRenewFlowKey(body.flowId, body.appId, user.userId),
        //     guardLevel('dev')
        // )
        // .post(
        //     '/update-options',
        //     async ({ body, user }) => await updateAppOptions(body.appId, user.userId, body.options),
        //     guardLevel('dev')
        // )
        // .post(
        //     '/update-params',
        //     async ({ body, user }) => await updateAppParams(body.appId, user.userId, body.params),
        //     guardLevel('dev')
        // )
        // .post(
        //     '/update-forms',
        //     async ({ body, user }) => await updateAppForms(body.appId, user.userId, body.forms),
        //     guardLevel('dev')
        // )
        // .post('/delete', async ({ body, user }) => await appDelete(body.appId, user), guardLevel('dev'))
    )
}
