<template>
    <g-dialog
        width="750px"
        @close="$emit('close')"
    >
        <template #title>
            <task-icon :local-task="localTask" />
            {{ $t('taskDeleteTable') }}
        </template>
        <template #content>
            <div class="task-delete g-dialog-content w-full">
                <template v-if="!showPreview">
                    <div class="control">
                        <div class="flex items-center gap-2">
                            <div class="grow">
                                <div class="control-label">
                                    {{ $t('taskLabel') }}
                                </div>
                                <n-input v-model:value="localTask.label" />
                            </div>
                            <div class="grow">
                                <div class="control-label">
                                    {{ $t('table') }}
                                </div>
                                <g-select-table v-model="localTask.tableName" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="flex-between flex">
                            <div class="control-label">
                                {{ $t('filters') }}
                            </div>
                            <div>
                                <n-button
                                    size="tiny"
                                    secondary
                                    @click="showPreview = true"
                                >
                                    <template #icon>
                                        <g-icon name="sql" />
                                    </template>
                                </n-button>
                            </div>
                        </div>
                        <g-filter-builder
                            :key="localTask.tableName"
                            :local-task="localTask"
                            :table-name="localTask.tableName"
                        />
                    </div>
                </template>
                <template v-else>
                    <g-query-preview
                        :local-task="localTask"
                        class="min-h-[200px]"
                        @close="showPreview = false"
                    />
                </template>
            </div>
            <div class="flex justify-end bg-paper-100 px-4 py-2 dark:bg-carbon-200">
                <n-button
                    type="primary"
                    @click="save()"
                >
                    {{ $t('save') }}
                </n-button>
            </div>
        </template>
    </g-dialog>
</template>

<script setup lang="ts">
import type { DeleteTaskType } from '@gaio/types'
import { onMounted, ref } from 'vue'

import useDefault from '@/composables/useDefault'
import useFlow from '@/composables/useFlow'
import { useAppStore } from '@/stores'

const emit = defineEmits(['close'])

const localTask = ref<DeleteTaskType>()
const showPreview = ref(false)

const save = () => {
    useFlow(useAppStore().flow.workflow)
        .generate({
            task: localTask.value,
            sources: [],
            targets: [
                useDefault({
                    type: 'table',
                    base: {
                        ...localTask.value,
                        label: localTask.value.tableName,
                        tableName: localTask.value.tableName
                    }
                })
            ]
        })
        .save()
        .then(() => emit('close'))
}

onMounted(() => {
    localTask.value = useDefault({
        type: 'delete',
        base: {
            ...useAppStore().appInfo,
            ...useAppStore().cloneTask()
        }
    })
})
</script>
