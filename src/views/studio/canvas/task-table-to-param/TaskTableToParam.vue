<template>
    <g-dialog
        width="600px"
        @close="$emit('close')"
    >
        <template #title>{{ $t('taskTableToParam') }}</template>
        <template #content>
            <div class="table-to-param overflow-auto">
                <div v-if="paramOptions.length > 1">
                    <div class="w-100 flex gap-2">
                        <div class="control grow">
                            <div class="control-label">{{ $t('taskLabel') }}</div>
                            <n-input v-model:value="localTask.label" />
                        </div>
                        <div class="control grow">
                            <div class="control-label">{{ $t('table') }}</div>
                            <n-input
                                v-model:value="localTask.tableName"
                                disabled
                            />
                        </div>
                    </div>

                    <n-card
                        content-style="padding: 10px"
                        class="mb-2"
                    >
                        <div class="flex flex-col">
                            <div class="align-items-center mb-2 flex">
                                <n-switch
                                    v-model:value="localTask.saveAsDefault"
                                    class="me-1"
                                    size="small"
                                />
                                {{ $t('saveAsDefault') }}
                            </div>
                            <div class="align-items-center flex">
                                <n-switch
                                    v-model:value="localTask.byReference"
                                    class="me-1"
                                    size="small"
                                    @update:value="loadColumnList()"
                                />
                                {{ $t('referenceColumnNames') }}
                            </div>
                        </div>
                    </n-card>
                    <n-card
                        v-if="localTask.byReference && localTask.fieldToParamList.length"
                        content-style="padding: 10px"
                    >
                        <table class="w-full table-auto">
                            <thead>
                                <tr class="vertical-mid text-left *:p-1">
                                    <th class="text-right">{{ $t('column') }}</th>
                                    <th>{{ $t('param') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="item of localTask.fieldToParamList"
                                    :key="item.columnName"
                                    class="tr-item border-b *:p-1 odd:bg-paper-200"
                                >
                                    <td class="text-right">
                                        <g-icon :name="dataTypeIcon(item.dataType)" />
                                        {{ item.columnName }}
                                    </td>
                                    <td>
                                        <n-select
                                            v-model:value="item.paramName"
                                            :options="paramOptions"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </n-card>
                </div>
                <n-card
                    v-else
                    content-style="padding: 10px"
                >
                    {{ $t('noParams') }}
                </n-card>
            </div>
            <div class="flex justify-end bg-paper-100 px-4 py-2 dark:bg-carbon-200">
                <n-button
                    :loading="loading"
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
import type { TableToParamTaskType } from '@gaio/types'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import useApi from '@/composables/useApi'
import useDataType from '@/composables/useDataType'
import useDefault from '@/composables/useDefault'
import useFlow from '@/composables/useFlow'
import { useAppStore } from '@/stores'

const emit = defineEmits(['close'])

const { t } = useI18n()
const localTask = ref<TableToParamTaskType>()
const loading = ref(false)

const { dataTypeIcon } = useDataType()

const paramOptions = computed(() => {
    return [{ label: t('none'), value: '' }].concat(
        useAppStore().params.map((item) => ({ value: item.paramName, label: item.paramName }))
    )
})

const loadColumnList = () => {
    useApi()
        .post('api/table/field', {
            body: {
                taskData: localTask.value
            }
        })
        .then((res) => {
            localTask.value.fieldToParamList = res.data
        })
}

const save = () => {
    loading.value = true
    const taskToBeSaved = useDefault({
        type: 'tableToParam',
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
            ]
        })
        .save()
        .then(() => emit('close'))
}

onMounted(() => {
    localTask.value = useDefault({
        type: 'tableToParam',
        base: useAppStore().cloneTask()
    })
    loadColumnList()
})
</script>
