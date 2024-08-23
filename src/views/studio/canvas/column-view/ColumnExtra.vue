<template>
    <div class="column-extra">
        <n-list bordered>
            <n-list-item>
                <div class="flex items-center justify-between">
                    {{ $t('emptyOrNull') }}
                    <div>{{ info.totalEmptyRows }}/{{ totalRows }}</div>
                </div>
            </n-list-item>
            <n-list-item>
                <div class="flex items-center justify-between">
                    {{ $t('countDistinct') }}
                    <div>{{ info.totalDistinctRows }}</div>
                </div>
            </n-list-item>

            <n-list-item v-if="isDate">
                <div class="flex items-center justify-between">
                    {{ $t('min') }}
                    <div>
                        {{ info.min }}
                    </div>
                </div>
            </n-list-item>
            <n-list-item v-if="isDate">
                <div class="flex items-center justify-between">
                    {{ $t('max') }}
                    <div>
                        {{ info.max }}
                    </div>
                </div>
            </n-list-item>
        </n-list>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import useApi from '@/composables/useApi'
import { useAppStore } from '@/stores'
import useDataType from '@/composables/useDataType'
import { useColumnView } from '@/views/studio/canvas/column-view/useColumnView'
const { dataTypeIsDate, dataTypeIsDateTime } = useDataType()
const { columnData, totalRows } = useColumnView().$state

const loading = ref(false)
const info = ref({
    totalEmptyRows: 0,
    totalDistinctRows: 0,
    min: '',
    max: ''
})

const task = computed(() => {
    return useAppStore().task
})

const loadExtraTableData = async () => {
    loading.value = true
    const { totalEmptyRows } = await useApi().post('api/table/empty', {
        body: {
            taskData: {
                ...task.value,
                columnName: columnData.columnName
            }
        }
    })

    const { totalDistinctRows } = await useApi().post('api/table/count-distinct', {
        body: {
            taskData: {
                ...task.value,
                columnName: columnData.columnName
            }
        }
    })

    let min: string
    let max: string

    if (isDate.value) {
        const dateResult = await useApi().post('api/table/min-max', {
            body: {
                taskData: {
                    ...task.value,
                    columnName: columnData.columnName
                }
            }
        })
        min = dateResult.min
        max = dateResult.max
    }

    info.value = {
        totalEmptyRows,
        totalDistinctRows,
        min,
        max
    }

    loading.value = false
}

const isDate = computed(() => {
    return dataTypeIsDate(columnData.dataType) || dataTypeIsDateTime(columnData.dataType)
})

onMounted(() => {
    loadExtraTableData()
})
</script>

<style scoped lang="scss">
.n-list-item {
    padding: 4px 15px !important;
    font-size: 14px !important;
}
</style>
