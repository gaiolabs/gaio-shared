<template>
    <div
        v-if="useReportStore().currentField"
        :key="useReportStore().currentField.id"
        class="options-field"
    >
        <n-page-header @back="useReportStore().currentField = null">
            <template #subtitle>
                <div>
                    <div class="text-lg text-prime">{{ useReportStore().currentField.columnName }}</div>
                </div>
            </template>
            <template #extra>
                <div>
                    <n-button
                        size="tiny"
                        type="error"
                        quaternary
                        @click="removeField()"
                    >
                        <template #icon>
                            <g-icon name="delete" />
                        </template>
                    </n-button>
                </div>
            </template>
        </n-page-header>
        <!--        <div class="control-secondary flex items-center justify-between">-->
        <!--            <div>{{ useReportStore().currentField.columnName }}</div>-->
        <!--        </div>-->

        <n-tabs
            class="mt-2"
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
                        :default-expanded-names="['summarize']"
                        arrow-placement="right"
                    >
                        <n-collapse-item name="general">
                            <template #header>
                                <div class="flex items-center gap-1">
                                    <g-icon name="general" />
                                    {{ $t('general') }}
                                </div>
                            </template>

                            <div class="control-secondary">
                                <div class="control">
                                    <div class="control-label">
                                        {{ $t('title') }}
                                    </div>
                                    <n-input
                                        v-model:value="useReportStore().currentField.title"
                                        :placeholder="$t('typeHere')"
                                    />
                                </div>
                                <div class="control">
                                    <div class="label">
                                        {{ $t('alias') }} & {{ $t('parameter') }}
                                        <n-select
                                            v-model:value="useReportStore().currentField.alias"
                                            filterable
                                            tag
                                            :placeholder="$t('alias')"
                                            :options="paramOptions"
                                        />
                                    </div>
                                </div>
                                <div class="control">
                                    <n-checkbox
                                        v-model:checked="useReportStore().currentField.hidden"
                                        :label="$t('hideField')"
                                        class="w-full"
                                    />
                                    <n-checkbox
                                        v-model:checked="useReportStore().currentField.html"
                                        :label="$t('htmlField')"
                                        class="w-full"
                                    />
                                </div>
                            </div>
                        </n-collapse-item>
                        <n-collapse-item name="summarize">
                            <template #header>
                                <div class="flex items-center gap-1">
                                    <g-icon name="summarize" />
                                    {{ $t('summarize') }}
                                </div>
                            </template>
                            <options-field-agg />
                        </n-collapse-item>
                        <n-collapse-item name="format">
                            <template #header>
                                <div class="flex items-center gap-1">
                                    <g-icon name="formatValue" />
                                    {{ $t('format') }}
                                </div>
                            </template>
                            <options-field-format />
                        </n-collapse-item>
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
                            <options-field-link />
                        </n-collapse-item>
                    </n-collapse>
                </div>
            </n-tab-pane>
            <n-tab-pane
                name="style"
                :tab="$t('styles')"
            >
                <n-collapse arrow-placement="right">
                    <n-collapse-item name="fontStyle">
                        <template #header>
                            <div class="flex items-center gap-1">
                                <g-icon name="style" />
                                {{ $t('fontStyle') }}
                            </div>
                        </template>
                        <options-field-style />
                    </n-collapse-item>
                    <n-collapse-item name="dynamic">
                        <template #header>
                            <div class="flex items-center gap-1">
                                <g-icon name="dynamic" />
                                {{ $t('dynamic') }}
                            </div>
                        </template>
                        <options-field-condition />
                    </n-collapse-item>
                </n-collapse>
            </n-tab-pane>
        </n-tabs>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useAppStore, useReportStore } from '@/stores'
import OptionsFieldAgg from '@/views/studio/canvas/task-explorer/task-explorer-options/options-field/OptionsFieldAgg.vue'
import OptionsFieldCondition from '@/views/studio/canvas/task-explorer/task-explorer-options/options-field/OptionsFieldCondition.vue'
import OptionsFieldFormat from '@/views/studio/canvas/task-explorer/task-explorer-options/options-field/OptionsFieldFormat.vue'
import OptionsFieldLink from '@/views/studio/canvas/task-explorer/task-explorer-options/options-field/OptionsFieldLink.vue'
import OptionsFieldStyle from '@/views/studio/canvas/task-explorer/task-explorer-options/options-field/OptionsFieldStyle.vue'

const { t } = useI18n()

const removeField = () => {
    useReportStore().current.schema.select = useReportStore().current.schema.select.filter(
        (o) => o.id !== useReportStore().currentField.id
    )
    useReportStore().currentField = null
}

const paramOptions = computed(() => {
    const noneList = [
        {
            value: '',
            label: t('none')
        }
    ]

    const params = useAppStore().params.map((o) => {
        return {
            value: o.paramName,
            label: o.paramName
        }
    })

    return noneList.concat(params)
})
</script>
