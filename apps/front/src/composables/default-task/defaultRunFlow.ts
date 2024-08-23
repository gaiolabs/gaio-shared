import type { FlowTaskType } from '@gaio/types/tasks/flow.task.type'
import type { TaskType } from '@gaio/types'

export const defaultRunFlow = (base: FlowTaskType & TaskType) => {
    return {
        id: base.id || null,
        type: 'flow',
        appId: base.appId,
        label: base.label || null,
        client: base.client || 'clickhouse',
        repoId: base.repoId || null,
        position: base.position || { x: 63, y: 381.25 },

        loopSize: base.loopSize || 0,
        flowId: base.flowId || null
    }
}
