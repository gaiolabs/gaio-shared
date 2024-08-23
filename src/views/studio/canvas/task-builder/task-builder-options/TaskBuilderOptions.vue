<template>
    <div class="task-builder-field-options h-full overflow-y-auto px-1 pe-2">
        <template v-if="localField?.type">
            <div class="mx-1 mb-2 flex items-start justify-between rounded-[8px] bg-elevation-1 p-2">
                <div>
                    <div class="overflow-hidden truncate font-bold">
                        {{ localField.field.columnName }}
                    </div>
                    <div
                        v-if="!localField.field.computedId"
                        class="flex items-center gap-1 overflow-hidden truncate text-[10px]"
                    >
                        <g-icon name="table" />
                        {{ localField.field.tableName }}
                    </div>
                </div>
                <div>
                    <n-button
                        size="tiny"
                        type="error"
                        quaternary
                        class="border-elevation-2 bg-paper-100 dark:bg-carbon-200"
                        @click="removeItem()"
                    >
                        <template #icon>
                            <g-icon name="delete" />
                        </template>
                    </n-button>
                </div>
            </div>
            <template v-if="!localField?.field?.computedId">
                <task-builder-options-select
                    v-if="localField.type === 'select'"
                    :key="localField.field.id"
                    :local-field="localField"
                    :local-task="localTask"
                />
                <task-builder-options-filter
                    v-if="localField.type === 'filter'"
                    :key="localField.field.id"
                    :local-field="localField"
                    :local-task="localTask"
                />
                <task-builder-options-sort
                    v-if="localField.type === 'sort'"
                    :key="localField.field.id"
                    :local-field="localField"
                    :local-task="localTask"
                />
            </template>
        </template>
        <template v-else>
            <n-alert :show-icon="false">
                {{ $t('selectField') }}
            </n-alert>
        </template>
    </div>
</template>

<script setup lang="ts">
import type { BuilderTaskType, FieldType } from '@gaio/types'
import type { PropType } from 'vue'

import TaskBuilderOptionsFilter from './TaskBuilderOptionsFilter.vue'
import TaskBuilderOptionsSelect from './TaskBuilderOptionsSelect.vue'
import TaskBuilderOptionsSort from './TaskBuilderOptionsSort.vue'

const props = defineProps({
    localField: {
        type: Object as PropType<{ type: string; field: Partial<FieldType> }>,
        required: true
    },
    localTask: {
        type: Object as PropType<BuilderTaskType>,
        required: true,
        default: () => null as BuilderTaskType
    }
})

const removeItem = () => {
    if (['filter', 'having'].includes(props.localField.type)) {
        props.localTask.schema[props.localField.type].forEach((filter, index) => {
            props.localTask.schema[props.localField.type][index].list = filter.list.filter(
                (item) => item.id !== props.localField.field.id
            )
        })
    } else {
        props.localTask.schema[props.localField.type] = props.localTask.schema[props.localField.type].filter(
            (item) => item.id !== props.localField.field.id
        )
    }
}
</script>
