<template>
    <div class="task-report-schema">
        <div v-if="useReportStore()?.current?.schema?.select" class="mx-1 flex items-center justify-between gap-1">
            <div class="flex items-center gap-1 font-bold">
                <g-icon name="columns" />
                {{ $t('columns') }}
                <span v-if="useReportStore().current.schema.select.length">
                    ({{ useReportStore().current.schema.select.length }})
                </span>
            </div>
            <div class="mb-1 flex gap-2">
                <n-popover v-if="useReportStore().current.schema.select.length" :width="240">
                    <div class="d-flex align-items-center justify-content-center w-full gap-2">
                        <n-radio-group v-model:value="useBrush" size="small">
                            <n-radio-button key="all" value="all">
                                {{ $t('all') }}
                            </n-radio-button>
                            <n-radio-button key="format" value="format">
                                {{ $t('format') }}
                            </n-radio-button>
                            <n-radio-button key="style" value="style">
                                {{ $t('style') }}
                            </n-radio-button>
                        </n-radio-group>
                    </div>
                    <template #trigger>
                        <span>
                            <n-button quaternary size="tiny" :type="useBrush ? 'primary' : 'default'"
                                @click="activeBrush">
                                <template #icon>
                                    <g-icon name="brush" />
                                </template>
                            </n-button>
                        </span>
                    </template>
                </n-popover>
                <n-tooltip :delay="1000">
                    <template #trigger>
                        <n-button quaternary size="tiny" :type="showFilter ? 'primary' : 'default'"
                            @click="showFilter = !showFilter">
                            <template #icon>
                                <g-icon name="filter" />
                            </template>
                        </n-button>
                    </template>
                    {{ $t('filter') }}
                </n-tooltip>
                <n-tooltip :delay="1000">
                    <template #trigger>
                        <n-button quaternary size="tiny" type="error"
                            class="border-elevation-2 bg-paper-100 dark:bg-carbon-200" @click="removeAll()">
                            <template #icon>
                                <g-icon name="deleteTag" />
                            </template>
                        </n-button>
                    </template>
                    {{ $t('deleteAllTags') }}
                </n-tooltip>
            </div>
        </div>

        <div class="mb-3 min-h-[40px] rounded border bg-paper-100 p-3 dark:bg-carbon-100">
            <vue-draggable :key="useReportStore().current.schema.select?.length"
                v-model="useReportStore().current.schema.select" :sort="true" group="fields" class="drag-table"
                @add="add">
                <v-tag v-for="(field, i) in useReportStore().current.schema.select" :key="i" :field="field"
                    :selected="useBrushSelected === field" class="me-2" :class="useBrushClasses"
                    @click="select(field)" />
            </vue-draggable>
        </div>

        <g-filter-builder v-if="showFilter" class="mb-3" :local-task="useReportStore().current"
            :table-name="useReportStore().current.tableName" />
    </div>
</template>

<script setup lang="ts">
import type { FieldType } from '@gaio/shared/types'
import { type SortableEvent } from 'sortablejs'
import { ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

import { useReportStore } from '@/stores'

const useBrush = ref()
const useBrushSelected = ref()

const showFilter = ref(false)

const removeAll = () => {
    useReportStore().current.schema.select = []
}

const add = (ev: SortableEvent) => {
    const { newDraggableIndex } = ev

    useReportStore().current.schema.select.forEach((field, index) => {
        if (index === newDraggableIndex) {
            useReportStore().current.schema.select[newDraggableIndex] = useReportStore().defineFieldOptions(field)
        }
    })

    useReportStore().currentField = useReportStore().current.schema.select[newDraggableIndex]
    useReportStore().refreshPreview()
}

const activeBrush = () => {
    if (useBrush.value) {
        useBrush.value = null
        useBrushSelected.value = null
    }
}

const useBrushClasses = () => {
    return useBrush.value ? 'cursor-grab' : ''
}

const select = (item: FieldType) => {
    if (useBrush.value && !useBrushSelected.value) {
        useBrushSelected.value = item
    } else if (useBrush.value && useBrushSelected.value) {
        useReportStore().current.schema.select = useReportStore().current.schema.select.map((field) => {
            if (field.id === item.id) {
                let format = {}

                if (useBrush.value === 'all' || useBrush.value === 'format') {
                    format = {
                        formatType: useBrushSelected.value.formatType,
                        formatDecimalSize: useBrushSelected.value.formatDecimalSize,
                        separators: useBrushSelected.value.separators,
                        formatDate: useBrushSelected.value.formatDate,
                        formatPrefix: useBrushSelected.value.formatPrefix,
                        formatSuffix: useBrushSelected.value.formatSuffix
                    }
                }

                let styleBase = {}
                if (useBrush.value === 'all' || useBrush.value === 'style') {
                    styleBase = {
                        fontWeight: useBrushSelected.value.fontWeight,
                        textAlign: useBrushSelected.value.textAlign,
                        fontSize: useBrushSelected.value.fontSize,
                        fontColor: useBrushSelected.value.fontColor,
                        tableWordBreak: useBrushSelected.value.tableWordBreak,

                        condType: useBrushSelected.value.condType,
                        condRules: useBrushSelected.value.condRules,
                        condColumnName: useBrushSelected.value.condColumnName
                    }
                }

                field = {
                    ...field,
                    ...format,
                    ...styleBase
                }
            }
            return field
        })
    } else {
        useReportStore().currentField = item
    }
}
</script>
