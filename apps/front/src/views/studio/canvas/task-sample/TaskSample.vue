<template>
    <g-dialog
        width="500px"
        @close="$emit('close')"
    >
        <template #title>{{ $t('taskSample') }}</template>
        <template #content>
            <div class="task-sample overflow-auto">
                <div class="mb-2">
                    <div class="font-semibold text-neutral-500">{{ $t('task') }}</div>
                    <n-input v-model:value="localTask.label" />
                </div>
                <div class="mb-2">
                    <div class="font-semibold text-neutral-500">{{ $t('resultTable') }}</div>
                    <n-input
                        v-model:value="localTask.resultTable"
                        v-alpha
                    />
                </div>
                <div class="mb-2">
                    <div class="font-semibold text-neutral-500">
                        {{ $t('type') }}
                    </div>
                    <n-select
                        v-model:value="localTask.calcType"
                        :options="[
                            { value: 'percent', label: $t('percentage') },
                            { value: 'rows', label: $t('rows') }
                        ]"
                        class="w-100"
                        @update:value="changeCalcType()"
                    />
                </div>
                <div class="mb-2">
                    <div class="font-semibold text-neutral-500">{{ $t('value') }}</div>
                    <div class="flex items-center gap-2">
                        <div
                            v-if="localTask.calcType === 'percent'"
                            class="grow"
                        >
                            <n-slider
                                v-model:value="localTask.calcValue"
                                class="w-full"
                                show-input
                                :format-tooltip="formatLabel"
                                :step="0.01"
                                :max="1"
                                :min="0"
                            />
                        </div>
                        <div :class="localTask.calcType === 'percent' ? 'max-w-[100px]' : 'grow'">
                            <n-input-number
                                v-model:value="localTask.calcValue"
                                class="w-100"
                            />
                        </div>
                    </div>
                </div>
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
import type { SampleTaskType } from '@gaio/types'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import useDefault from '@/composables/useDefault'
import useFlow from '@/composables/useFlow'
import { useAppStore } from '@/stores'

const emit = defineEmits(['close'])

const { t } = useI18n()

const localTask = ref<SampleTaskType>()

const changeCalcType = () => {
    if (localTask.value.calcType === 'percent') {
        localTask.value.calcValue = 0.7
    } else {
        localTask.value.calcValue = 1000
    }
}

const formatLabel = (n) => {
    return (n * 100).toFixed(0) + '%'
}

const save = () => {
    const taskToBeSaved = useDefault({
        type: 'sample',
        base: {
            ...useAppStore().appInfo,
            ...localTask.value
        }
    })

    useFlow(useAppStore().flow.workflow)
        .generate({
            task: taskToBeSaved,
            sources: [
                useDefault({
                    type: 'table',
                    base: {
                        ...useAppStore().appInfo,
                        ...taskToBeSaved
                    }
                })
            ],
            targets: [
                useDefault({
                    type: 'table',
                    base: {
                        ...taskToBeSaved,
                        label: taskToBeSaved.resultTable,
                        tableName: taskToBeSaved.resultTable
                    }
                })
            ]
        })
        .save()
        .then(() => emit('close'))
}

onMounted(() => {
    localTask.value = useDefault({
        type: 'sample',
        base: {
            ...useAppStore().appInfo,
            ...useAppStore().cloneTask()
        }
    })

    if (!localTask.value.label) {
        localTask.value.label = `${t('taskSample')}`
    }

    if (!localTask.value.resultTable) {
        localTask.value.resultTable = `sample_${localTask.value.tableName}`
    }
})
</script>
