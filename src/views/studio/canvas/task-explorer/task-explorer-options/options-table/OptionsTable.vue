<template>
    <div class="options-table p-2 px-1">
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
                            <options-table-general />
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
                        <n-collapse-item name="forms">
                            <template #header>
                                <div class="flex items-center gap-1">
                                    <g-icon name="formOption" />
                                    {{ $t('forms') }}
                                </div>
                            </template>
                            <options-forms />
                        </n-collapse-item>
                        <n-collapse-item name="rowsPerPage">
                            <template #header>
                                <div class="flex items-center gap-1">
                                    <g-icon name="rowsPerPage" />
                                    {{ $t('rowsPerPage') }}
                                </div>
                            </template>
                            <options-rows-per-page />
                        </n-collapse-item>
                        <n-collapse-item
                            :title="$t('filters')"
                            name="filters"
                        >
                            <template #header>
                                <div class="flex items-center gap-1">
                                    <g-icon name="filterCheck" />
                                    {{ $t('filters') }}
                                </div>
                            </template>
                            <options-table-filters />
                        </n-collapse-item>
                        <n-collapse-item
                            :title="$t('download')"
                            name="download"
                        >
                            <template #header>
                                <div class="flex items-center gap-1">
                                    <g-icon name="downloadFile" />
                                    {{ $t('download') }}
                                </div>
                            </template>
                            <options-download />
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
                name="style"
                :tab="$t('styles')"
            >
                <div class="px-1">
                    <n-collapse
                        :default-expanded-names="['personalize']"
                        arrow-placement="right"
                    >
                        <n-collapse-item
                            :title="$t('personalize')"
                            name="personalize"
                        >
                            <template #header>
                                <div class="flex items-center gap-1">
                                    <g-icon name="style" />
                                    {{ $t('personalize') }}
                                </div>
                            </template>

                            <div>
                                <div class="control-secondary w-full">
                                    <n-checkbox
                                        v-model:checked="useReportStore().current.settings.headerBackgroundDark"
                                        :label="$t('headerBackgroundDark')"
                                    />
                                </div>
                                <div class="control-secondary w-full">
                                    <n-checkbox
                                        v-model:checked="useReportStore().current.settings.tableStriped"
                                        :label="$t('tableStriped')"
                                        class="w-full"
                                    />
                                    <!--                                    <n-checkbox-->
                                    <!--                                        v-model:checked="useReportStore().current.settings.tableHover"-->
                                    <!--                                        :label="$t('tableHover')"-->
                                    <!--                                        class="w-full"-->
                                    <!--                                    />-->
                                    <n-checkbox
                                        v-model:checked="useReportStore().current.settings.tableSm"
                                        :label="$t('tableSm')"
                                        class="w-full"
                                    />
                                    <n-checkbox
                                        v-model:checked="useReportStore().current.settings.tableBordered"
                                        :label="$t('tableBordered')"
                                        class="w-full"
                                    />
                                    <n-checkbox
                                        v-model:checked="useReportStore().current.settings.tableSingleColumn"
                                        :label="$t('tableSingleColumn')"
                                        class="w-full"
                                    />
                                    <n-checkbox
                                        v-model:checked="useReportStore().current.settings.tableSingleLine"
                                        :label="$t('tableSingleLine')"
                                        class="w-full"
                                    />
                                </div>
                            </div>
                        </n-collapse-item>
                    </n-collapse>
                </div>
            </n-tab-pane>
        </n-tabs>
    </div>
</template>
/template>
<script setup lang="ts">
import { useReportStore } from '@/stores'
import OptionsDownload from '@/views/studio/canvas/task-explorer/task-explorer-options/options-general/OptionsDownload.vue'
import OptionsForms from '@/views/studio/canvas/task-explorer/task-explorer-options/options-general/OptionsForms.vue'
import OptionsMessage from '@/views/studio/canvas/task-explorer/task-explorer-options/options-general/OptionsMessage.vue'
import OptionsRowsPerPage from '@/views/studio/canvas/task-explorer/task-explorer-options/options-general/OptionsRowsPerPage.vue'
import OptionsTitle from '@/views/studio/canvas/task-explorer/task-explorer-options/options-general/OptionsTitle.vue'
import OptionsTableFilters from '@/views/studio/canvas/task-explorer/task-explorer-options/options-table/OptionsTableFilters.vue'
import OptionsTableGeneral from '@/views/studio/canvas/task-explorer/task-explorer-options/options-table/OptionsTableGeneral.vue'
</script>

<style lang="scss">
.n-collapse-item-arrow {
    display: none;
}
</style>
