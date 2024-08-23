<template>
    <div
        v-if="task"
        class="report-card"
    >
        <template v-if="task.reportType === 'table'">
            <report-table
                :task="task"
                :height="height"
                :card-height="cardHeight"
                @trigger="$emit('trigger', $event)"
            />
        </template>
        <template v-if="task.reportType === 'card'">
            <report-card />
        </template>
        <template v-if="task.reportType === 'download'">
            <report-download :task="task" />
        </template>
        <template v-if="['line', 'bar', 'area', 'pie', 'treemap'].includes(task.reportType)">
            <report-chart
                :task="task"
                :height="height"
                :card-height="cardHeight"
            />
        </template>
        <template v-if="task.reportType === 'form'">
            <report-form
                :task="task"
                :height="height"
            />
        </template>
    </div>
</template>
<script setup lang="ts">
import type { ReportNodeType } from '@gaio/types/tasks/report.type'
import { computed } from 'vue'

import ReportChart from '@/views/report/report-chart/ReportChart.vue'
import ReportForm from '@/views/report/report-form/ReportForm.vue'
import ReportTable from '@/views/report/report-table/ReportTable.vue'
import ReportCard from '@/views/report/ReportCard.vue'
import ReportDownload from '@/views/report/ReportDownload.vue'

defineEmits(['trigger'])
const props = defineProps<{ task: ReportNodeType }>()

const cardHeight = computed(() => {
    return (props.task?.height || 300) + 'px'
})

const height = computed(() => {
    if (props.task && props.task && props.task.settings) {
        if (props.task && props.task.settings && props.task.settings.showHeader && props.task.settings.title) {
            return (props.task.height || 300) - 100 + 'px'
        } else if ((props.task && props.task.settings && props.task.settings.showHeader) || props.task.settings.title) {
            return (props.task.height || 300) - 50 + 'px'
        }
        return (props.task.height || 300) - 20 + 'px'
    }
    return '90px'
})
</script>
