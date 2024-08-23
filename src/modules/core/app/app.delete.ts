import type { AppType } from '@gaio/types'
import type { Context } from 'hono'
import { AppModel, FlowModel, MetaModel, MetaViewModel, PassModel, TagModel, TaskLogModel } from '../../../models'

export const appDelete = async ({ appId }: Partial<AppType>) => {
    await AppModel.deleteApp(appId)
    await FlowModel.deleteFlowByAppId(appId)
    await MetaModel.deleteMetaByAppId(appId)
    await MetaViewModel.deleteMetaViewByAppId(appId)
    // to do - remove meta and views inside metaViewStory
    await TaskLogModel.deleteTaskLogByAppId(appId)
    await TagModel.deleteTagByAppId(appId)
    await PassModel.deletePassByAppId(appId)

    // try {
    //
    //     const repoInfo = await this.gaio
    //         .query(`select repoId from apps where appId = ?`, [appId])
    //         .then((res) => res[0]);
    //
    //     await this.gaio.query(` delete from tags where ref = ?`, [appId]);
    //     await this.gaio.query(` delete from insights where appId = ?`, [appId]);
    //     await this.gaio.query(` delete from pass where appId = ?`, [appId]);
    //     await this.gaio.query(` delete from models where appId = ?`, [appId]);
    //     await this.gaio.query(` delete from flow where appId = ?`, [appId]);
    //     await this.gaio.query(` delete from maps where appId = ?`, [appId]);
    //     await this.gaio.query(` delete from templates where appId = ?`, [appId]);
    //     await this.gaio.query(` delete from survey where appId = ?`, [appId]);
    //     await this.gaio.query(` delete from jobs where appId = ?`, [appId]);
    //     await this.gaio.query(` delete from drafts where appId = ?`, [appId]);
    //     await this.gaio.query(` delete from content where appId = ?`, [appId]);
    //     await this.gaio.query(` delete from envs where envKey = ?`, [`env_${appId}`]);
    //
    //     await remove(join(__dirname, '..', '..', '..', 'content', 'app', `${appId}`));
    //     await remove(join(__dirname, '..', '..', '..', 'content', 'template', `${appId}`));
    //
    //
    //     if (repoInfo && repoInfo.repoId) {
    //         await this.dropBucket(repoInfo.repoId, appId);
    //     }
    //
    //     return { message: 'Success' };
    // } catch (e) {
    //     return { message: e.message };
    // }
    //

    return { status: 'done' }
}
