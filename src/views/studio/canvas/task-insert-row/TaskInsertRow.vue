<template>
    <g-dialog width="750px" @close="$emit('close')">
        <template #title>{{ $t('taskInsertRow') }}</template>
        <template #content>
            <div class="task-insert-row g-dialog-content w-full">
                <div class="control">
                    <div class="flex items-center gap-2">
                        <div class="grow">
                            <div class="control-label">
                                {{ $t('task') }}
                            </div>
                            <n-input v-model:value="localTask.label" />
                        </div>
                        <div class="grow">
                            <div class="control-label">{{ $t('table') }}</div>
                            <g-select-table v-model="localTask.tableName" :disabled="!!localTask.id"
                                @update="showPreview = false" />
                        </div>
                    </div>
                </div>

                <div v-if="!localTask.tableName"
                    class="flex items-center justify-start rounded-[4px] bg-blue-100 px-4 py-1 text-sm text-carbon-300 dark:bg-blue-500">
                    {{ $t('chooseATable') }}
                </div>

                <template v-if="showPreview">
                    <g-query-preview :local-task="localTask" class="min-h-[200px]" @close="showPreview = false" />
                </template>

                <div v-if="localTask.tableName && !showPreview" class="control">
                    <div class="flex justify-between">
                        <div class="control-label items-center justify-center gap-2">
                            <g-icon name="columns" />
                            {{ $t('columns') }}
                        </div>
                        <div>
                            <n-button size="tiny" secondary @click="showPreview = true">
                                <template #icon>
                                    <g-icon name="sql" />
                                </template>
                            </n-button>
                        </div>
                    </div>

                    <div class="flex flex-col gap-4 bg-paper-100 p-2 dark:bg-carbon-200">
                        <g-define-column-value :local-task="localTask" type="insert" />
                        <div v-if="!localTask"
                            class="flex items-center justify-start rounded-sm bg-blue-100 px-4 py-1 text-sm text-carbon-300">
                            {{ $t('selectColumn') }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex items-center justify-end bg-paper-100 px-4 py-2 dark:bg-carbon-200">
                <n-button type="primary" @click="save()">
                    {{ $t('save') }}
                </n-button>
            </div>
        </template>
    </g-dialog>
</template>
<script setup lang="ts">
import type { InsertRowTaskType } from '@gaio/shared/types'
import { onMounted, ref } from 'vue'

import GDefineColumnValue from '@/components/GDefineColumnValue.vue'
import useDefault from '@/composables/useDefault'
import useFlow from '@/composables/useFlow'
import { useAppStore } from '@/stores'

const emit = defineEmits(['close'])
const localTask = ref<InsertRowTaskType>({})
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
        type: 'insertRow',
        base: {
            ...useAppStore().appInfo,
            ...useAppStore().cloneTask()
        }
    })
})
</script>
