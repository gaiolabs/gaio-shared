<template>
    <div class="table-data overflow-y-hidden">
        <div class="g-bg-1 rounded p-2 shadow">
            <div class="table-data-header mb-3 mt-2 flex justify-between">
                <table-data-filter :columns="columns" :local-task="localTask" :total-rows="totalRows"
                    :total-rows-filtered="pagination.total" class="flex-grow" @load-filter="applyFilter" />
            </div>
            <div v-if="localColumns.length" class="w-fit-content mb-5 overflow-x-auto">
                <n-spin :show="loading">
                    <n-table striped :single-line="false" size="small">
                        <thead class="sticky">
                            <tr>
                                <th v-for="col of localColumns" :key="col.columnName"
                                    @click="$emit('selectColumn', col)">
                                    <div class="flex justify-between gap-2">
                                        <n-button text>
                                            <template #icon>
                                                <g-icon :name="dataTypeIcon(col.dataType)" />
                                            </template>
                                            {{ col.columnName }}
                                        </n-button>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, index) of list" :key="index">
                                <td v-for="col of localColumns" :key="col.columnName">
                                    {{ row[col.columnName] }}
                                </td>
                            </tr>
                        </tbody>
                    </n-table>
                </n-spin>
            </div>
            <div v-else-if="!loading && !list.length" class="w-full">
                <n-alert>
                    {{ $t('noData') }}
                </n-alert>
            </div>
            <div v-if="!loading || list.length" class="mt-2 flex items-center justify-center">
                <n-pagination v-model:page="pagination.current" size="small" :item-count="pagination.total"
                    :page-size="pagination.pageSize" @update:page="listData()" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { BuilderTaskType, FieldType, GenericType } from '@gaio/shared/types'
import { computed, onMounted, ref, watch } from 'vue'

import useApi from '@/composables/useApi'
import useDataType from '@/composables/useDataType'
import { useAppStore, useAuthStore, useTableStore } from '@/stores'
import TableDataFilter from '@/views/studio/canvas/table-view/TableDataFilter.vue'

type LocalFieldType = {
    width?: number
} & FieldType

const props = defineProps<{
    itemsPerPage: number
    localTask: BuilderTaskType
    columns: LocalFieldType[]
    loading: boolean
    totalRows: number
}>()

const emit = defineEmits(['load', 'selectColumn'])

const { dataTypeIcon } = useDataType()
const list = ref<GenericType[]>([])
const applyFilter = (filter) => {
    useAppStore().task = {
        ...useAppStore().task,
        schema: {
            ...useAppStore().task.schema,
            select: props.columns,
            filter
        }
    }
    listData()
}

const listData = async () => {
    emit('load', true)

    const { data, error } = await useApi().post(`api/table/rows`, {
        body: {
            taskData: {
                ...props.localTask,
                schema: {
                    select: props.columns,
                    limit: props.itemsPerPage || 10,
                    offset: (pagination.value.current - 1) * pagination.value.pageSize,
                    filter: useTableStore().getFilter(props.localTask)
                }
            }
        }
    })

    if (error) {
        // hasError.value = true
    }

    list.value = data || []
    pagination.value.total = props.totalRows || 0

    emit('load', false)
}

const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 100
})

const localColumns = computed(() => {
    return props.columns.map((column) => {
        const columnValues = list.value.map((item) => {
            return item[column.columnName] ? item[column.columnName] : ''
        })

        const maxColumnValueSize = Math.max(
            ...columnValues.map((item) => {
                return item.toString().length
            })
        )

        const maxColumnNameSize = (column.columnName?.length || 0) + 2
        const width = maxColumnNameSize > maxColumnValueSize ? maxColumnNameSize : maxColumnValueSize

        return {
            ...column,
            width: width * 10
        } as LocalFieldType
    })
})

watch(
    () => useAuthStore().user.options.tableViewPageSize,
    () => listData()
)

onMounted(async () => {
    pagination.value.current = 1
    await listData()
})
</script>

<style lang="scss">
.table-data {
    table {

        td,
        th {
            white-space: nowrap;
            padding-right: 0.8rem;
            padding-left: 0.8rem;
        }
    }
}
</style>
