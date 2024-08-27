<template>
    <g-dialog @close="$emit('close')">
        <template #title>
            <task-icon :local-task="localTask" />
            {{ $t('taskQuickTable') }}
        </template>
        <template #content>
            <div class="task-quick-table size-full flex-col items-center justify-center">
                <div class="flex flex-col gap-2 overflow-auto">
                    <div class="control">
                        <div class="control-label rounded bg-paper-200 p-3 dark:bg-carbon-300">
                            <p>{{ $t('quickTableInfo') }}</p>
                        </div>
                    </div>
                    <div class="control">
                        <n-card content-style="padding: 10px">
                            <n-input v-model:value="localContent" type="textarea" :placeholder="$t('csvDataHere')"
                                rows="6" />
                        </n-card>
                    </div>
                    <div class="control flex grow justify-center" @click="prepare()">
                        <n-button type="primary" :loading="loading" block>
                            {{ $t('prepareData') }}
                        </n-button>
                    </div>
                    <div v-if="localData.length && localTask.columns.length" class="control">
                        <n-card content-style="padding: 10px">
                            <div class="control">
                                <div class="control-label rounded bg-paper-200 p-3 dark:bg-carbon-300"
                                    v-html="$t('quickTableHelper')" />
                            </div>
                            <div class="block">
                                <table class="table-bordered table-striped table-sm table w-full">
                                    <thead>
                                        <tr>
                                            <th v-for="(col, index) of localTask.columns" :key="index">
                                                <div class="flex items-center justify-between">
                                                    <div>
                                                        <n-popover placement="right" width="400" trigger="click">
                                                            <div>
                                                                <div>
                                                                    <n-radio v-model="col.dataType"
                                                                        label="Nullable(String)" class="w-full">
                                                                        {{
                                                                            dataTypeClickhouseNames('Nullable(String)')
                                                                        }}
                                                                    </n-radio>
                                                                    <n-radio v-model="col.dataType"
                                                                        label="Nullable(Int64)" class="w-full">
                                                                        {{ dataTypeClickhouseNames('Nullable(Int64)') }}
                                                                    </n-radio>
                                                                    <n-radio v-model="col.dataType"
                                                                        label="Nullable(Float64)" class="w-full">
                                                                        {{
                                                                            dataTypeClickhouseNames('Nullable(Float64)')
                                                                        }}
                                                                    </n-radio>
                                                                    <n-radio v-model="col.dataType"
                                                                        label="Nullable(Date)" class="w-full">
                                                                        {{ dataTypeClickhouseNames('Nullable(Date)') }}
                                                                    </n-radio>
                                                                    <n-radio v-model="col.dataType"
                                                                        label="Nullable(DateTime)" class="w-full">
                                                                        {{
                                                                            dataTypeClickhouseNames(
                                                                                'Nullable(DateTime)'
                                                                            )
                                                                        }}
                                                                    </n-radio>
                                                                </div>
                                                            </div>
                                                            <template #trigger>
                                                                <g-icon :name="dataTypeIcon(col.dataType)"
                                                                    style="font-size: 11px" />
                                                            </template>
                                                        </n-popover>
                                                        {{ col.columnName }}
                                                    </div>
                                                    <div class="el-text-right">
                                                        <n-popconfirm :width="350" @positive-click="removeColumn(col)">
                                                            <template #trigger>
                                                                <g-icon name="delete" color="#e32" />
                                                            </template>
                                                            {{ $t('deleteConfirm') }}
                                                        </n-popconfirm>
                                                    </div>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(row, rowIndex) of localData.slice(size * (page - 1), size * page)"
                                            :key="rowIndex">
                                            <td v-for="(col, colIndex) of localTask.columns" :key="colIndex">
                                                {{ row[col.columnName] }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-if="localData.length > size" class="d-flex justify-content-center w-100">
                                <n-pagination v-model:default-page="page" small background :page-size="size"
                                    :total="localData.length" />
                            </div>
                        </n-card>
                    </div>
                    <div v-if="localData.length > 0" class="control">
                        <div class="control">
                            <div class="control-label">{{ $t('resultTable') }}</div>
                            <n-input v-model:value="localTask.resultTable" v-alpha class="w-full" />
                        </div>
                        <div class="control flex flex-col">
                            <n-checkbox v-model:checked="localTask.dropTable" :label="$t('dropOrCreate')" />
                            <n-checkbox v-model:checked="saveReference" :label="$t('createReference')" />
                        </div>
                    </div>
                </div>
                <div v-if="localData.length && localTask.columns.length"
                    class="flex justify-end bg-paper-100 px-4 py-2 dark:bg-carbon-200">
                    <n-button :loading="loading" class="w-100" type="primary" :disabled="!localTask.resultTable"
                        @click="run()">
                        {{ $t('execute') }}
                    </n-button>
                </div>
            </div>
        </template>
    </g-dialog>
</template>
<script setup lang="ts">
import type { QuickTableTaskType } from '@gaio/shared/types'
import { deburr } from 'lodash-es'
import Papa from 'papaparse'
import { onMounted, ref } from 'vue'

import useApi from '@/composables/useApi'
import useDataType from '@/composables/useDataType'
import useDefault from '@/composables/useDefault'
import useFlow from '@/composables/useFlow'
import { useAppStore } from '@/stores'

const localContent = ref('')
const saveReference = ref(false)
let localData = []
let page = 1
const size = 10

const { dataTypeIcon, dataTypeClickhouseNames } = useDataType()

const emit = defineEmits(['close'])

const localTask = ref<QuickTableTaskType>()
const loading = ref<boolean>(false)

function prepare() {
    loading.value = true
    page = 1

    Papa.parse(localContent.value, {
        worker: false,
        header: true,
        transformHeader: (header) => deburr(header.replace(/\s/g, '')),
        skipEmptyLines: true,
        dynamicTyping: false,
        complete: (res) => {
            loading.value = false
            localData = res.data
            localTask.value.columns = (res.meta.fields || []).map((h) => {
                return {
                    columnName: `${h}`.trim(),
                    dataType: 'Nullable(String)',
                    columnLength: 2
                }
            })
        },
        error: () => {
            loading.value = false
        }
    })
}

function removeColumn(col) {
    for (let item of localData) {
        delete item[col.columnName]
    }
    localTask.value.columns = localTask.value.columns.filter((item) => col.columnName !== item.columnName)
}

function run() {
    loading.value = true
    localTask.value.data = localData

    useApi()
        .post('api/task/run', {
            body: {
                taskData: localTask.value,
                params: [],
                flowId: useAppStore().flow.flowId,
                appId: useAppStore().flow.appId
            }
        })
        .then(() => {
            if (saveReference.value) {
                save()
            }
        })
        .catch((e) => {
            console.log('error', e)
            loading.value = false
        })
        .finally(() => {
            loading.value = false
        })
}

const save = () => {
    loading.value = true

    useFlow(useAppStore().flow.workflow)
        .generate({
            task: useDefault({
                type: 'table',
                base: {
                    ...useAppStore().appInfo,
                    ...localTask.value,
                    label: localTask.value.resultTable,
                    tableName: localTask.value.resultTable
                }
            })
        })
        .save()
        .then(() => emit('close'))
}

onMounted(() => {
    localTask.value = useDefault({
        type: 'quickTable',
        base: {
            ...useAppStore().appInfo,
            ...useAppStore().cloneTask()
        }
    })
})
</script>
