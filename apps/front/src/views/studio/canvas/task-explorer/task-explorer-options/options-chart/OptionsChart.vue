<template>
    <div class="options-chart">
        <n-tabs
            type="segment"
            animated
            size="small"
        >
            <n-tab-pane
                name="properties"
                :tab="$t('properties')"
            >
                <div class="px-1">
                    <n-collapse
                        accordion
                        arrow-placement="right"
                    >
                        <n-collapse-item name="general">
                            <template #header>
                                <div class="flex items-center gap-1">
                                    <g-icon name="general" />
                                    {{ $t('general') }}
                                </div>
                            </template>
                            <options-chart-general />
                        </n-collapse-item>
                        <n-collapse-item
                            v-if="useReportStore().showOnlyIf(['pie']) && !useReportStore().current.settings.pieDonut"
                            name="statistic"
                        >
                            <template #header>
                                <div class="flex items-center gap-1">
                                    <g-icon name="total" />
                                    {{ $t('statistic') }}
                                </div>
                            </template>
                            <options-chart-statistic />
                        </n-collapse-item>
                        <n-collapse-item name="legend">
                            <template #header>
                                <div class="flex items-center gap-1">
                                    <g-icon name="legend" />
                                    {{ $t('legend') }}
                                </div>
                            </template>
                            <options-chart-legend />
                        </n-collapse-item>
                        <n-collapse-item
                            name="label"
                            :title="$t('label')"
                        >
                            <template #header>
                                <div class="flex items-center gap-1">
                                    <g-icon name="label" />
                                    {{ $t('label') }}
                                </div>
                            </template>
                            <options-chart-label />
                        </n-collapse-item>
                        <n-collapse-item
                            :title="$t('title')"
                            name="title"
                        >
                            <template #header>
                                <div class="flex items-center gap-1">
                                    <g-icon name="cardTitle" />
                                    {{ $t('title') }}
                                </div>
                            </template>
                            <options-title />
                        </n-collapse-item>
                        <template
                            v-if="
                                useReportStore().showOnlyIf([
                                    'bar',
                                    'column',
                                    'forecast',
                                    'bullet',
                                    'combo',
                                    'stacked',
                                    'area',
                                    'line',
                                    'scatter',
                                    'bubble',
                                    'histogram',
                                    'dual'
                                ])
                            "
                        >
                            <n-collapse-item
                                :title="$t('xAxis')"
                                name="xAxis"
                            >
                                <template #header>
                                    <div class="flex items-center gap-1">
                                        <g-icon name="xAxis" />
                                        {{ $t('xAxis') }}
                                    </div>
                                </template>
                                <options-chart-x-axis />
                            </n-collapse-item>
                            <n-collapse-item
                                v-if="
                                    useReportStore().showOnlyIf([
                                        'bar',
                                        'column',
                                        'forecast',
                                        'bullet',
                                        'combo',
                                        'stacked',
                                        'area',
                                        'line',
                                        'scatter',
                                        'bubble',
                                        'histogram',
                                        'dual'
                                    ])
                                "
                                :title="$t('yAxis')"
                                name="yAxis"
                            >
                                <template #header>
                                    <div class="flex items-center gap-1">
                                        <g-icon name="yAxis" />
                                        {{ $t('yAxis') }}
                                    </div>
                                </template>
                                <options-chart-y-axis />
                            </n-collapse-item>
                        </template>
                        <n-collapse-item
                            :title="$t('link')"
                            name="link"
                        >
                            <template #header>
                                <div class="flex items-center gap-1">
                                    <g-icon name="link" />
                                    {{ $t('link') }}
                                </div>
                            </template>
                            <options-chart-link />
                        </n-collapse-item>
                        <n-collapse-item
                            :title="$t('margin')"
                            name="margin"
                        >
                            <template #header>
                                <div class="flex items-center gap-1">
                                    <g-icon name="margin" />
                                    {{ $t('margin') }}
                                </div>
                            </template>
                            <options-chart-margin />
                        </n-collapse-item>
                        <n-collapse-item name="limitRows">
                            <template #header>
                                <div class="flex items-center gap-1">
                                    <g-icon name="limitRows" />
                                    {{ $t('limitRows') }}
                                </div>
                            </template>
                            <options-chart-limit-rows />
                        </n-collapse-item>
                        <n-collapse-item name="rowsPerPage">
                            <template #header>
                                <div class="flex items-center gap-1">
                                    <g-icon name="rowsPerPage" />
                                    {{ $t('rowsDisplayed') }}
                                </div>
                            </template>
                            <options-rows-per-page />
                        </n-collapse-item>
                        <n-collapse-item name="message">
                            <template #header>
                                <div class="flex items-center gap-1">
                                    <g-icon name="info" />
                                    {{ $t('message') }}
                                </div>
                            </template>
                            <options-message />
                        </n-collapse-item>
                    </n-collapse>
                </div>
            </n-tab-pane>
            <n-tab-pane
                name="theme"
                :tab="$t('theme')"
            >
                <div class="mt-1">
                    <options-theme />
                </div>
            </n-tab-pane>
        </n-tabs>
        <!--        <n-checkbox-->
        <!--            v-model:checked="useReportStore().current.settings.showLabel"-->
        <!--            :label="$t('showLabel')"-->
        <!--        />-->
    </div>
</template>
<script setup lang="ts">
import { useReportStore } from '@/stores'
import OptionsChartGeneral from '@/views/studio/canvas/task-explorer/task-explorer-options/options-chart/OptionsChartGeneral.vue'
import OptionsChartLabel from '@/views/studio/canvas/task-explorer/task-explorer-options/options-chart/OptionsChartLabel.vue'
import OptionsChartLegend from '@/views/studio/canvas/task-explorer/task-explorer-options/options-chart/OptionsChartLegend.vue'
import OptionsChartLimitRows from '@/views/studio/canvas/task-explorer/task-explorer-options/options-chart/OptionsChartLimitRows.vue'
import OptionsChartLink from '@/views/studio/canvas/task-explorer/task-explorer-options/options-chart/OptionsChartLink.vue'
import OptionsChartMargin from '@/views/studio/canvas/task-explorer/task-explorer-options/options-chart/OptionsChartMargin.vue'
import OptionsChartStatistic from '@/views/studio/canvas/task-explorer/task-explorer-options/options-chart/OptionsChartStatistic.vue'
import OptionsChartXAxis from '@/views/studio/canvas/task-explorer/task-explorer-options/options-chart/OptionsChartXAxis.vue'
import OptionsChartYAxis from '@/views/studio/canvas/task-explorer/task-explorer-options/options-chart/OptionsChartYAxis.vue'
import OptionsMessage from '@/views/studio/canvas/task-explorer/task-explorer-options/options-general/OptionsMessage.vue'
import OptionsRowsPerPage from '@/views/studio/canvas/task-explorer/task-explorer-options/options-general/OptionsRowsPerPage.vue'
import OptionsTheme from '@/views/studio/canvas/task-explorer/task-explorer-options/options-general/OptionsTheme.vue'
import OptionsTitle from '@/views/studio/canvas/task-explorer/task-explorer-options/options-general/OptionsTitle.vue'
</script>
