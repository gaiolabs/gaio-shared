<template>
    <g-dialog @close="emit('close')">
        <template #title>
            <task-icon :local-task="localTask" />
            {{ $t('taskRest') }}
        </template>
        <template #content>
            <div v-if="localTask" class="task-rest size-full flex-col items-center justify-center">
                <div class="flex flex-col items-center justify-center gap-1 overflow-auto">
                    <div class="flex w-full items-center gap-2">
                        <div class="flex w-full flex-col gap-1">
                            <label class="control-label" for="task">
                                {{ $t('task') }}
                            </label>
                            <n-input v-model:value="localTask.label" />
                        </div>
                        <div class="flex w-full flex-col gap-1">
                            <label class="control-label">
                                {{ $t('table') }}
                            </label>
                            <n-input v-model:value="localTask.tableName" v-alpha disabled />
                        </div>
                    </div>
                </div>
                <n-tabs pane-class="bg-elevation-1" size="small" type="line" :default-value="currentTab">
                    <n-tab-pane name="general" :tab="$t('general')">
                        <task-rest-general :local-task="localTask" />
                    </n-tab-pane>
                    <n-tab-pane name="basicAuth" :tab="$t('basicAuth')" display-directive="show:lazy">
                        <task-rest-basic-auth :local-task="localTask" />
                    </n-tab-pane>
                    <n-tab-pane name="headers" :tab="$t('headers')">
                        <task-rest-headers :local-task="localTask" />
                    </n-tab-pane>
                    <n-tab-pane name="result" :tab="$t('result')">
                        <task-rest-result :local-task="localTask" />
                    </n-tab-pane>
                    <n-tab-pane name="errorLog" :tab="$t('errorLog')">
                        <task-rest-error-log :local-task="localTask" />
                    </n-tab-pane>
                </n-tabs>
            </div>
            <div class="flex justify-between bg-paper-100 px-4 py-2 dark:bg-carbon-200">
                <n-button secondary @click="$emit('close')">
                    {{ $t('cancel') }}
                </n-button>
                <n-button type="primary" @click="save()">
                    {{ $t('save') }}
                </n-button>
            </div>
        </template>
    </g-dialog>
</template>
<script setup lang="ts">
import type { RestTaskType } from '@gaio/shared/types'
import { onMounted, ref } from 'vue'

import useDefault from '@/composables/useDefault'
import useFlow from '@/composables/useFlow'
import { useAppStore } from '@/stores'

import TaskRestBasicAuth from './TaskRestBasicAuth.vue'
import TaskRestErrorLog from './TaskRestErrorLog.vue'
import TaskRestGeneral from './TaskRestGeneral.vue'
import TaskRestHeaders from './TaskRestHeaders.vue'
import TaskRestResult from './TaskRestResult.vue'

const emit = defineEmits(['close'])

const localTask = ref<RestTaskType>()
const currentTab = ref('general')
// const headersRef = ref(localTask.value?.headers)

const save = () => {
    useFlow(useAppStore().flow.workflow)
        .generate({
            task: localTask.value,
            sources: [
                useDefault({
                    type: 'table',
                    base: {
                        ...useAppStore().appInfo,
                        ...localTask.value
                    }
                })
            ],
            targets: [
                useDefault({
                    type: 'table',
                    base: {
                        ...localTask.value,
                        label: localTask.value.resultTable,
                        tableName: localTask.value.resultTable
                    }
                })
            ]
        })
        .save()
        .then(() => emit('close'))
}

onMounted(() => {
    localTask.value = useDefault({
        type: 'rest',
        base: {
            ...useAppStore().appInfo,
            ...useAppStore().cloneTask()
        }
    })
    console.log(localTask.value)
})
</script>
