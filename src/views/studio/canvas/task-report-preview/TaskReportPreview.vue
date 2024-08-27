<template>
    <g-dialog @close="$emit('close')">
        <template #title>
            {{ $t('report') }}
        </template>
        <template #content>
            <div class="overflow-auto">
                <report-node :task="task" />
            </div>
        </template>
    </g-dialog>
</template>
<script setup lang="ts">
import type { ReportNodeType } from '@gaio/shared/types'

import { useAppStore } from '@/stores'
import ReportNode from '@/views/report/ReportNode.vue'

defineEmits(['close'])

const task = useAppStore().flow.workflow.nodes.find(
    (task) => task.id === useAppStore().cloneTask()['reportId']
) as ReportNodeType

useAppStore().task = task
</script>
