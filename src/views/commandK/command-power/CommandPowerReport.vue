<template>
    <div class="command-power-report h-full">
        <div class="grid h-full grid-cols-[200px_1fr_200px]">
            <div class="g-bg-3 flex flex-col p-2">
                <div>
                    {{ usePowerStore().selectedContext.label }}
                </div>
                <n-button color="#fff">
                    <span class="text-black">
                        {{ $t('filter') }}
                    </span>
                </n-button>
            </div>
            <div v-if="report" class="command-power-report-body">
                <command-power-report-options :report="report" @change="changeReportType" />
                <report-node :key="report.id" :task="{
                    ...report,
                    height: 500
                }" />
            </div>
            <div class="g-bg-3 h-full">Insights</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { ReportNodeType } from '@gaio/shared/types'
import { getBucketNameFromAppId, getId } from '@gaio/shared/utils'
import { cloneDeep } from 'lodash-es'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { defaultSchema } from '@/composables/default-task/defaultSchema'
import useDefaultReport from '@/composables/useDefaultReport'
import { usePowerReport } from '@/composables/usePowerReport'
import CommandPowerReportOptions from '@/views/commandK/command-power/CommandPowerReportOptions.vue'
import ReportNode from '@/views/report/ReportNode.vue'
import { usePowerStore } from '@/stores'

const { t } = useI18n()

const report = ref<ReportNodeType>({})

const changeReportType = (ev) => {
    report.value.reportType = ev.reportType
    report.value.settings = {
        ...report.value.settings,
        ...ev.settings
    }
}

const generateReport = () => {
    let prepareReport = cloneDeep(report.value)
    const tableName = usePowerStore().selectedContext.tableName
    const databaseName = getBucketNameFromAppId(usePowerStore().selectedContext.appId)

    if (usePowerStore().selectedView.metaViewId) {
        report.value = usePowerStore().selectedView.task
    } else {
        if (!report?.value?.schema) {
            prepareReport = {
                client: 'clickhouse',
                sourceType: 'bucket',
                appId: usePowerStore().selectedContext.appId,
                repoId: usePowerStore().selectedContext.repoId,
                tableName,
                databaseName,
                label: 'Report',
                type: 'report',
                reportType: 'table',
                schema: defaultSchema,
                settings: {
                    forms: []
                }
            }

            prepareReport = useDefaultReport({
                type: 'report',
                reportType: 'column',
                base: prepareReport
            })
        }

        console.log('tags', usePowerStore().tags)

        usePowerReport(t, prepareReport, usePowerStore().tags, usePowerStore().selectedContext.fields, [
            { operator: '=', list: [], andOr: 'and' }
        ])
            .prepare()
            .then((o) => {
                console.log(usePowerStore().tags, 'tags, dois')
                prepareReport = o.task
                prepareReport.reportType = o.view.reportType
                prepareReport.schema = o.task.schema
                prepareReport.settings = o.task.settings
                prepareReport.settings.type = o.view.settingType
                report.value = prepareReport
                report.value.id = getId()
            })
    }
}

watch(
    () => usePowerStore().tags,
    () => generateReport(),
    {
        deep: true
    }
)

onMounted(() => {
    if (!usePowerStore().selectedView || !usePowerStore().selectedView.tags) {
        usePowerStore().selectedView = {
            label: '',
            appId: usePowerStore().selectedContext.appId,
            repoId: usePowerStore().selectedContext.repoId,
            metaId: usePowerStore().selectedContext.metaId,
            options: {},
            shared: false
        }
        generateReport()
    } else {
        report.value = usePowerStore().selectedView.task
        usePowerStore().tags = usePowerStore().selectedView.tags
    }
})
</script>

<style lang="scss">
.command-power-report {
    .command-power-report-body {

        .report-chart,
        .report-table div:first-child {
            border: 0 !important;
        }
    }
}
</style>
