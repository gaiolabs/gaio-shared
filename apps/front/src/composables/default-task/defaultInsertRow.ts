import type { TaskType, InsertRowTaskType } from '@gaio/types'
import { defaultSchema } from '@/composables/default-task/defaultSchema'

export const defaultInsertRow = (base: InsertRowTaskType & TaskType) => {
    return {
        id: base.id || null,
        type: 'insertRow',
        appId: base.appId,
        label: base.label || null,
        client: base.client || 'clickhouse',
        repoId: base.repoId || null,
        shared: !!base.shared,
        created: !!base.created,
        position: base.position || { x: 63, y: 381.25 },
        sourceId: base.sourceId || null,
        tableName: base.tableName || null,
        temporary: !!base.temporary,
        sourceType: base.sourceType || 'bucket',
        databaseName: base.databaseName || null,
        schema: base.schema || defaultSchema,
        clearMutation: base.clearMutation
    }
}
