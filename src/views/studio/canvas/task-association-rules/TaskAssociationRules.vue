<template>
    <g-dialog width="600px" @close="$emit('close')">
        <template #title>{{ $t('taskBasket') }}</template>
        <template #content>
            <div class="task-association-rules size-full flex-col items-center justify-center">
                <div class="flex flex-col items-center justify-center gap-1 overflow-auto bg-elevation-1">
                    <div class="flex w-full justify-center gap-2">
                        <div class="flex w-full flex-col gap-1">
                            <label class="font-semibold text-neutral-500" for="task">
                                {{ $t('taskLabel') }}
                            </label>
                            <n-input v-model:value="localTask.label" />
                        </div>
                    </div>
                    <div class="flex w-full items-center gap-2">
                        <div class="control grow">
                            <label class="font-semibold text-neutral-500">
                                {{ $t('sourceTable') }}
                            </label>
                            <n-input v-model:value="localTask.tableName" disabled class="w-100" />
                        </div>
                        <div class="control grow">
                            <label class="font-semibold text-neutral-500">
                                {{ $t('resultTable') }}
                            </label>
                            <n-input v-model:value="localTask.resultTable" v-alpha />
                        </div>
                    </div>
                    <div class="mb-2 w-full space-y-2 rounded-md bg-white p-4 px-2.5">
                        <div class="flex items-center gap-2">
                            <div class="flex w-full flex-col gap-1">
                                <label class="font-semibold text-neutral-500">{{ $t('minSupport') }}</label>
                                <n-input-number v-model:value="localTask.minSupport" required :min="0.2" :max="1"
                                    :step="0.01" />
                            </div>
                            <div class="flex w-full flex-col gap-1">
                                <label class="font-semibold text-neutral-500">{{ $t('minThreshold') }}</label>
                                <n-input-number v-model:value="localTask.minThreshold" required :min="0.8" :max="1"
                                    :step="0.01" />
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="flex w-full flex-col gap-1">
                                <label class="font-semibold text-neutral-500" for="columnReference">
                                    {{ $t('columnReference') }}
                                </label>
                                <g-select-column id="columnReference" v-model:value="localTask.columnReference"
                                    :table-name="localTask.tableName" />
                            </div>
                            <div class="flex w-full flex-col gap-1">
                                <label class="font-semibold text-neutral-500" for="column">
                                    {{ $t('columnCategory') }}
                                </label>
                                <g-select-column id="columnReference" v-model:value="localTask.columnCategory"
                                    :table-name="localTask.tableName" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex justify-end bg-paper-100 px-4 py-2 dark:bg-carbon-200">
                    <n-button type="primary" :loading="loading" @click="save()">
                        {{ $t('save') }}
                    </n-button>
                </div>
            </div>
        </template>
    </g-dialog>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { AssociationRulesTaskType } from '@gaio/shared/types'
import useFlow from '@/composables/useFlow'
import { getBucketNameFromAppId } from '@gaio/shared/utils'
import useDefault from '@/composables/useDefault'
import { useAppStore } from '@/stores'

const emit = defineEmits(['close'])
const loading = ref(false)
const localTask = ref<AssociationRulesTaskType>({})

const save = () => {
    loading.value = true

    useFlow(useAppStore().flow.workflow)
        .generate({
            task: localTask.value,
            sources: [
                useDefault({
                    type: 'table',
                    base: localTask.value
                })
            ],
            targets: [
                useDefault({
                    type: 'table',
                    base: {
                        ...localTask.value,
                        tableName: localTask.value.resultTable,
                        databaseName: getBucketNameFromAppId(localTask.value.appId)
                    }
                })
            ]
        })
        .save()
        .then(() => emit('close'))
}

onMounted(() => {
    localTask.value = useDefault({
        type: 'basket',
        base: {
            ...useAppStore().appInfo,
            ...useAppStore().cloneTask()
        }
    })
    console.log('mounted')
})
</script>
