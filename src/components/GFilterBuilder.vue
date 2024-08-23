<template>
    <div class="filter-builder">
        <div
            v-if="hasFilter"
            class="canvas-task-update-body"
        >
            <n-card
                v-if="columns"
                content-style="padding: 10px"
            >
                <table
                    v-if="localTask.schema.filter[0].list.length > 0"
                    class="w-full table-auto"
                >
                    <thead>
                        <tr class="vertical-mid border-b text-left *:p-1">
                            <th
                                class="el-text-center"
                                style="width: 45px"
                            >
                                <n-button
                                    size="tiny"
                                    secondary
                                    @click="addCol()"
                                >
                                    <template #icon>
                                        <g-icon name="add" />
                                    </template>
                                </n-button>
                            </th>
                            <th>{{ $t('column') }}</th>
                            <th>{{ $t('type') }}</th>
                            <th>{{ $t('operator') }}</th>
                            <th>{{ $t('value') }}</th>
                            <th style="width: 25px"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(item, index) in localTask.schema.filter[0].list"
                            :key="index"
                            class="vertical-mid border-b text-left *:p-1 odd:bg-paper-200"
                        >
                            <td
                                v-if="index > 0"
                                class="text-right"
                            >
                                <n-button
                                    size="tiny"
                                    type="primary"
                                    @click="item.andOr = item.andOr === 'and' ? 'or' : 'and'"
                                >
                                    {{ item.andOr }}
                                </n-button>
                            </td>
                            <td v-else></td>
                            <td>
                                <n-select
                                    v-model:value="item.columnName"
                                    filterable
                                    :options="columnList"
                                    value-field="columnName"
                                    label-field="columnName"
                                    @update:value="changeFilter(item)"
                                />
                            </td>
                            <td>
                                <n-select
                                    v-model:value="item.valueType"
                                    :options="[
                                        {
                                            value: 'value',
                                            label: $t('value')
                                        },
                                        {
                                            value: 'parameter',
                                            label: $t('parameter')
                                        },
                                        {
                                            value: 'computed',
                                            label: $t('computed')
                                        }
                                    ]"
                                    class="min-w-[100px]"
                                />
                            </td>
                            <td>
                                <n-select
                                    v-model:value="item.operator"
                                    filterable
                                    :options="operators(item)"
                                />
                            </td>
                            <td>
                                <span v-if="!['isNull', 'isNotNull'].includes(item.operator)">
                                    <span v-if="item.valueType === 'value'">
                                        <n-input-group v-if="!['in', 'notIn'].includes(item.operator)">
                                            <n-input
                                                v-model:value="item.value"
                                                :placeholder="$t('value')"
                                                type="text"
                                            />
                                            <n-popover
                                                :width="350"
                                                trigger="click"
                                            >
                                                <n-select
                                                    v-model:value="item.value"
                                                    filterable
                                                    clearable
                                                    :placeholder="$t('filter')"
                                                    :options="columnValues[item.columnName]"
                                                />
                                                <template #trigger>
                                                    <n-button
                                                        :underline="false"
                                                        class="w-100 h-100"
                                                        @click="listByField(item)"
                                                    >
                                                        <g-icon name="eye" />
                                                    </n-button>
                                                </template>
                                            </n-popover>
                                        </n-input-group>
                                        <template v-else>
                                            <n-select
                                                v-model:value="item.value"
                                                tag
                                                multiple
                                                filterable
                                                clearable
                                                :placeholder="$t('filter')"
                                                :options="columnValues[item.columnName]"
                                                @focus="listByField(item)"
                                            />
                                        </template>
                                    </span>
                                    <template v-else-if="item.valueType === 'parameter'">
                                        <n-select
                                            v-model:value="item.value"
                                            class="w-100"
                                            filterable
                                            value-field="paramName"
                                            label-field="paramName"
                                            :options="params"
                                        />
                                    </template>
                                    <template v-else-if="item.valueType === 'computed'">
                                        <div class="control-label">
                                            {{ $t('computed') }}
                                        </div>
                                        <div
                                            class="control"
                                            style="min-height: 90px"
                                        >
                                            <code-editor
                                                v-model="item.value"
                                                class="h-[90px] min-w-[250px] overflow-hidden rounded"
                                                :labels="columns.map((o) => o.columnName)"
                                            />
                                        </div>
                                    </template>
                                </span>
                            </td>
                            <td>
                                <n-button
                                    size="tiny"
                                    quaternary
                                    type="error"
                                    @click="deleteFilter(item.id)"
                                >
                                    <template #icon>
                                        <g-icon name="delete" />
                                    </template>
                                </n-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div
                    v-else
                    class="w-100"
                >
                    <n-alert :closable="false">
                        <div class="flex w-full items-center justify-between">
                            <div class="grow">
                                {{ $t('addFilter') }}
                            </div>
                            <div>
                                <n-button
                                    type="primary"
                                    @click="addCol()"
                                >
                                    {{ $t('add') }}
                                </n-button>
                            </div>
                        </div>
                    </n-alert>
                </div>
            </n-card>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { BuilderTaskType, FieldType } from '@gaio/types'
import { getId } from '@gaio/utils'
import { cloneDeep } from 'lodash-es'
import { NButton } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import useApi from '@/composables/useApi'
import useDataType from '@/composables/useDataType'
import useHelper from '@/composables/useHelper'
import { useAppStore } from '@/stores'

const { t } = useI18n()

const props = defineProps({
    localTask: {
        type: Object as () => BuilderTaskType,
        required: true,
        default: () => ({}) as BuilderTaskType
    },
    tableName: {
        type: String,
        required: true
    }
})

const { dataTypeName } = useDataType()
const { operatorsFilters } = useHelper()

const columnValues = ref({})
const columns = ref([])

const listByField = (col: FieldType) => {
    useApi()
        .post('api/table/rows', {
            body: {
                params: useAppStore().params,
                taskData: {
                    ...props.localTask,
                    schema: {
                        select: [
                            {
                                ...col,
                                type: 'value',
                                distinct: true
                            }
                        ],
                        sort: [{ ...col, alias: col.columnName, order: 'asc' }],
                        limit: 100
                    }
                }
            }
        })
        .then(
            (res) =>
                (columnValues.value[col.columnName] = res.data.map((item) => ({
                    label: item[col.columnName],
                    value: item[col.columnName]
                })))
        )
}

const params = computed(() => {
    return useAppStore().params
})

const columnList = computed<Partial<FieldType>>(() => {
    return cloneDeep(columns.value).map((o) => {
        o.id = getId(6)
        o.valueType = 'value'
        o.andOr = 'and'
        o.operator = '='
        return o
    })
})

const hasFilter = computed(() => {
    return props.localTask.schema && props.localTask.schema.filter && props.localTask.schema.filter[0]
})

const changeFilter = (item) => {
    item.columnLength = columnList.value.find((o) => o.columnName === item.columnName).columnLength
    item.dataType = columnList.value.find((o) => o.columnName === item.columnName).dataType
}

const deleteFilter = (id) => {
    props.localTask.schema.filter[0].list = props.localTask.schema.filter[0].list.filter((o) => o.id !== id)
}

const operators = (item) => {
    let op = dataTypeName(item.dataType)
    if (op !== 'number' && op !== 'text') {
        op = 'date'
    }
    return (operatorsFilters[op].filter((o) => !['between', 'notBetween'].includes(o.operator)) || []).map((o) => {
        return {
            value: o.operator,
            label: t(o.name)
        }
    })
}

const addCol = () => {
    const lt = cloneDeep(props.localTask)
    lt.schema.filter[0].list.push({
        ...columnList.value[0],
        valueType: 'value',
        andOr: 'and',
        operator: '=',
        id: getId(6)
    })

    props.localTask.schema.filter = cloneDeep(lt.schema.filter)
}

const loadColumnList = () => {
    const taskData = {
        ...useAppStore().appInfo,
        tableName: props.tableName,
        sourceType: 'bucket',
        client: 'clickhouse'
    }

    useApi()
        .post('api/table/field', {
            body: {
                taskData
            }
        })
        .then((res) => (columns.value = res.data))
}

onMounted(() => loadColumnList())
</script>
