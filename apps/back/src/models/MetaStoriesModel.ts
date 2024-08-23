import { dbGaio } from '../db/db.gaio'

const getMetaStoriesByUser = async (userId: string) => {
    return await dbGaio('getMetaStoriesByUser').query(
        `SELECT *, 'story' as metaType, 'powerStory' as icon FROM meta_story
	        WHERE userId = {userId: String}`,
        {
            params: {
                userId
            }
        }
    )
}

export default {
    getMetaStoriesByUser
}
