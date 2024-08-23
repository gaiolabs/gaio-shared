<template>
    <div class="task-report-setup h-full p-2">
        <div class="h-full rounded bg-paper-100 p-2 dark:bg-carbon-100">
            <n-tabs
                v-model:value="useReportStore().currentSetupActiveTab"
                type="segment"
                animated
                size="small"
            >
                <n-tab-pane
                    name="source"
                    :tab="$t('source')"
                >
                    <task-report-setup-fields />
                </n-tab-pane>
                <n-tab-pane
                    name="reportType"
                    :tab="$t('type')"
                >
                    <task-report-setup-type />
                </n-tab-pane>
            </n-tabs>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useReportStore } from '@/stores'
import TaskReportSetupFields from '@/views/studio/canvas/task-explorer/TaskExplorerSetupFields.vue'
import TaskReportSetupType from '@/views/studio/canvas/task-explorer/TaskExplorerSetupType.vue'
</script>
