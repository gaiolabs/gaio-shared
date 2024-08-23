export default (app) => {
    app.group('/api/base', (route) =>
        route.get('/run', async () => {
            // return await PassModel.getListOfAppsBucketHasAccess('app:169');
            return {}
        })
    )
}
