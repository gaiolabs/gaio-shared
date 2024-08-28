<template>
    <div class="task-builder-join-control">
        <g-dialog :show="!!joinItem" @close="$emit('close')">
            <template #title>
                <div class="flex items-center gap-1">
                    <g-icon name="join" />
                    {{ $t('join') }}
                </div>
            </template>
            <template #content>
                <div v-if="localJoin" class="w-full">
                    <div class="mb-1">
                        {{ $t('type') }}
                    </div>
                    <n-select v-model:value="currentType" size="small" :options="joinListTypes
                        .map((o) => ({
                            label: $t(o.label),
                            value: o.currentType
                        }))
                        .concat([
                            {
                                label: $t('computed'),
                                value: 4
                            }
                        ])
                        " />
                    <!--DEFAULT RAW JOIN-->
                    <div v-if="currentType === 4" class="raw-builder-join mt-2">
                        <n-card content-style="padding: 6px">
                            <code-editor v-model="localJoin.raw" language="sql"
                                class="h-[300px] overflow-hidden rounded-[8px]" />
                        </n-card>

                        <n-card content-style="padding: 6px" class="mt-2">
                            <n-table size="small" :columns="columnRefs" :data="localJoin.refs" :pagination="false">
                                <thead>
                                    <tr>
                                        <th v-for="col of columnRefs" :key="col.title">
                                            {{ col.title }}
                                        </th>
                                        <th class="w-[30px]">
                                            <n-button size="tiny" quaternary type="info" @click="
                                                localJoin.refs.push({
                                                    id: useHelper().generateId(),
                                                    databaseName: '',
                                                    tableName: ''
                                                })
                                                ">
                                                <template #icon>
                                                    <g-icon name="addCheck" />
                                                </template>
                                            </n-button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) of localJoin.refs" :key="index">
                                        <td v-for="(col, colRefIndex) of columnRefs" :key="colRefIndex">
                                            <n-input v-model:value="item[col.key]" class="w-full"
                                                :placeholder="$t('typeHere')" size="tiny" />
                                        </td>
                                        <td>
                                            <n-button quaternary size="tiny" type="error" @click="
                                                localJoin.refs.splice(
                                                    localJoin.refs.findIndex((o) => o.id === item.id),
                                                    1
                                                )
                                                ">
                                                <template #icon>
                                                    <g-icon name="delete" />
                                                </template>
                                            </n-button>
                                        </td>
                                    </tr>
                                </tbody>
                            </n-table>
                        </n-card>
                    </div>

                    <!--DEFAULT BUILDER JOIN-->
                    <div v-else class="default-builder-join">
                        <n-card class="my-2" content-style="padding: 10px">
                            <!--DATABASE -->
                            <div class="mb-2 flex gap-2">
                                <div class="w-[50%] grow">
                                    <div class="mb-1">{{ $t('database') }}</div>
                                    <n-select v-model:value="localJoin.byDatabaseName"
                                        :default-active-first-option="true" size="small" allow-search
                                        :options="leftSourceDatabaseList" />
                                </div>
                            </div>
                            <div class="grow">
                                <div>{{ $t('table') }}</div>
                                <n-select v-model:value="localJoin.by" size="small" :placeholder="$t('selectTable')"
                                    :options="tableList.left
                                        .filter((o) => o.databaseName === localJoin.byDatabaseName)
                                        .map((o) => {
                                            return {
                                                label: o.tableName,
                                                value: o.tableName
                                            }
                                        })
                                        " @update:value="loadColumnsFrom('tableLeft', 'left')" />
                            </div>
                        </n-card>
                        <n-card class="my-2" content-style="padding: 10px">
                            <div>
                                <div class="w-[50%] grow">
                                    <div class="mb-1">{{ $t('database') }}</div>
                                    <n-select v-model:value="localJoin.toDatabaseName" size="small" :options="sourceList.map((o) => {
                                        return {
                                            label: o.databaseName,
                                            value: o.databaseName
                                        }
                                    })
                                        " />
                                </div>
                            </div>
                            <!--TABLES-->
                            <div class="flex items-center gap-2">
                                <div class="flex h-full grow items-end pt-5 text-center">
                                    <n-button size="small" block type="primary" @click="changeJoinType">
                                        <template #icon>
                                            <g-icon :name="`${joinListTypes[currentType]?.value}Join`" />
                                        </template>
                                    </n-button>
                                </div>
                                <div class="w-[45%] grow">
                                    <div>{{ $t('table') }}</div>
                                    <n-select v-model:value="localJoin.to" :default-active-first-option="true"
                                        size="small" allow-search :placeholder="$t('selectTable')" :options="tableList.right.map((o) => ({
                                            label: o.tableName,
                                            value: o.tableName
                                        }))
                                            " @update:value="loadColumnsFrom('tableRight', 'right')" />
                                </div>
                            </div>
                        </n-card>
                        <n-card v-if="localJoin.by && localJoin.to" class="my-2" content-style="padding: 10px">
                            <div class="mb-2 flex items-end gap-2">
                                <div class="w-[50%] grow">
                                    <div class="mb-1">{{ $t('columns') }}</div>
                                    <n-select v-model:value="selectedColumns.left" size="small"
                                        :placeholder="$t('selectColumn')" :options="columnList.left.map((o) => ({
                                            label: o.columnName,
                                            value: o.columnName
                                        }))
                                            " />
                                </div>
                                <div class="w-[50%] grow">
                                    <div class="mb-1">{{ $t('columns') }}</div>
                                    <n-select v-model:value="selectedColumns.right" :default-active-first-option="true"
                                        size="small" allow-search :placeholder="$t('selectColumn')" :options="columnList.right.map((o) => ({
                                            label: o.columnName,
                                            value: o.columnName
                                        }))
                                            " />
                                </div>
                                <div>
                                    <n-button :disabled="!validateAddColumnButton" size="small" type="primary"
                                        @click="addNewColumnReference()">
                                        {{ $t('add') }}
                                    </n-button>
                                </div>
                            </div>
                        </n-card>

                        <div v-if="localJoin?.list?.length"
                            class="mt-2 rounded-[8px] border bg-paper-100 p-2 dark:bg-carbon-100">
                            <div v-for="(sub, subIndex) of localJoin.list" :key="subIndex"
                                class="mb-1 flex w-full items-center rounded border-elevation-2">
                                <div class="min-w-[150px] grow rounded-s bg-elevation-1 p-1 text-center">
                                    {{ sub.columnBy }}
                                </div>
                                <div class="px-2 text-center">
                                    {{ sub.operator }}
                                </div>
                                <div class="min-w-[150px] grow bg-elevation-1 p-1 text-center">
                                    {{ sub.columnTo }}
                                </div>
                                <div class="flex max-w-[30px] flex-none justify-center px-1">
                                    <n-button size="tiny" quaternary type="error"
                                        @click="localJoin.list.splice(subIndex, 1)">
                                        <g-icon name="delete" />
                                    </n-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex justify-end bg-paper-100 px-4 py-2 dark:bg-carbon-200">
                    <n-button type="primary" @click="save()">
                        {{ $t('confirm') }}
                    </n-button>
                </div>
            </template>
        </g-dialog>
    </div>
</template>

<script setup lang="ts">
import type { BuilderTaskType, SchemaJoinType, TableType } from '@gaio/shared/types'
import { cloneDeep, uniq, uniqBy } from 'lodash-es'
import { useMessage } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import useApi from '@/composables/useApi'
import useHelper from '@/composables/useHelper'
import { useAppStore } from '@/stores'

const { t } = useI18n()
const props = defineProps<{ localTask: BuilderTaskType; joinIndex: number | undefined; joinItem: SchemaJoinType }>()
const emit = defineEmits(['close'])

const message = useMessage()

const columnRefs = [
    {
        title: t('database'),
        key: 'databaseName'
    },
    {
        title: t('table'),
        key: 'tableName'
    }
]

const joinListTypes = [
    {
        label: 'innerJoin',
        value: 'inner',
        currentType: 0
    },
    {
        label: 'leftJoin',
        value: 'left',
        currentType: 1
    },
    {
        label: 'rightJoin',
        value: 'right',
        currentType: 2
    },
    {
        label: 'fullJoin',
        value: 'full',
        currentType: 3
    }
]

const tableList = ref({
    backup: [] as Partial<TableType>[],
    left: [] as Partial<TableType>[],
    right: [] as Partial<TableType>[]
})

const localJoin = ref()
const currentType = ref(0)
const columnList = ref({
    left: [],
    right: []
})

const selectedColumns = ref({
    left: '' as string,
    right: '' as string
})

const validateAddColumnButton = computed(() => {
    return selectedColumns.value.left && selectedColumns.value.right
})

const updateDatabaseAndTableReferences = () => {
    if (currentType.value === 4) {
        localJoin.value.refs.forEach((o) => {
            o.byDatabaseName = localJoin.value.byDatabaseName
            o.toDatabaseName = localJoin.value.toDatabaseName
            o.tableBy = localJoin.value.by
            o.tableTo = localJoin.value.to
        })
    } else {
        localJoin.value.list.forEach((o) => {
            o.byDatabaseName = localJoin.value.byDatabaseName
            o.toDatabaseName = localJoin.value.toDatabaseName
            o.tableBy = localJoin.value.by
            o.tableTo = localJoin.value.to
        })
    }
}

const addNewColumnReference = () => {
    localJoin.value.list.push({
        id: useHelper().generateId(),
        andOr: 'and',
        columnBy: selectedColumns.value.left,
        columnTo: selectedColumns.value.right,
        tableBy: localJoin.value.by,
        tableTo: localJoin.value.to,
        byDatabaseName: localJoin.value.byDatabaseName,
        toDatabaseName: localJoin.value.toDatabaseName,
        operator: '='
    })
}
const changeJoinType = () => {
    if (currentType.value < joinListTypes.length - 1) {
        currentType.value += 1
    } else {
        currentType.value = 0
    }

    message.destroyAll()
    message.info(t(joinListTypes[currentType.value].label), {
        showIcon: false
    })
}

const sourceList = computed(() => {
    if (props.localTask.sourceType === 'bucket') {
        return useAppStore().sourceList.filter((o) => o.sourceType === 'bucket' && o.client !== 'salesforce')
    }
    return useAppStore().sourceList.filter((o) => o.sourceId === props.localTask.sourceId && o.client !== 'salesforce')
})

const loadTablesFrom = async (tableSide: 'left' | 'right', databaseSide: 'byDatabaseName' | 'toDatabaseName') => {
    updateDatabaseAndTableReferences()
    if (tableSide === 'left') {
        tableList.value.left = tableList.value.backup.filter((o) => o.databaseName === localJoin.value.byDatabaseName)
    } else {
        const { data } = await useApi().post(`api/table/list`, {
            body: {
                taskData: {
                    ...props.localTask,
                    tableName: localJoin.value[tableSide],
                    databaseName: localJoin.value[databaseSide]
                }
            }
        })
        tableList.value[tableSide] = data
    }
}

const loadColumnsFrom = async (tableSide: 'tableLeft' | 'tableRight', fieldSide: 'left' | 'right', clear = true) => {
    updateDatabaseAndTableReferences()
    if (clear) {
        if (fieldSide === 'left') {
            localJoin.value.columnLeft = undefined
        } else {
            localJoin.value.columnRight = undefined
        }
    }

    const { data } = await useApi().post(`api/table/field`, {
        body: {
            taskData: {
                ...props.localTask,
                tableName: localJoin.value[tableSide === 'tableLeft' ? 'by' : 'to'],
                databaseName: fieldSide === 'left' ? localJoin.value.byDatabaseName : localJoin.value.toDatabaseName
            }
        }
    })

    columnList.value[fieldSide] = data
}

const defineOriginalTableList = () => {
    tableList.value.backup.push({
        tableName: props.localTask.tableName,
        databaseName: props.localTask.databaseName
    })

    tableList.value.backup = tableList.value.backup.concat(
        props.localTask.schema.join.map((o) => {
            if (o.to !== props.localTask.tableName) {
                return {
                    tableName: o.to,
                    databaseName: o.toDatabaseName || props.localTask.databaseName
                }
            }
        })
    )

    tableList.value.backup = uniqBy(tableList.value.backup, 'tableName')
    tableList.value.left = cloneDeep(tableList.value.backup)
}

const defineLocalJoin = () => {
    localJoin.value = cloneDeep(props.joinItem)

    if (localJoin.value.type === 'raw') {
        currentType.value = 4
        localJoin.value.raw = localJoin.value.raw || ''
        localJoin.value.refs = localJoin.value.refs || []
    } else {
        localJoin.value = {
            ...localJoin.value,
            byDatabaseName: localJoin.value.byDatabaseName || props.localTask.databaseName,
            toDatabaseName: localJoin.value.toDatabaseName || props.localTask.databaseName,
            tableLeft: localJoin.value.tableBy,
            tableRight: localJoin.value.tableTo,
            columnLeft: localJoin.value.columnBy,
            columnRight: localJoin.value.columnTo,
            refs: []
        }
        currentType.value = joinListTypes.findIndex((o) => o.value === localJoin.value.type)
    }

    loadColumnsFrom('tableLeft', 'left', false)
    loadColumnsFrom('tableRight', 'right', false)
}

const leftSourceDatabaseList = computed(() => {
    return uniq(
        tableList.value.backup.map((o) => {
            return {
                label: o.databaseName,
                value: o.databaseName
            }
        })
    )
})

const validateSaving = () => {
    if (currentType.value === 4) {
        if (!localJoin.value.raw) {
            message.error(t('requiredComputed'))
            return
        }
    } else {
        if (!localJoin.value.list.length) {
            message.error(t('requiredColumns'))
            return
        }
    }
    return true
}

const save = () => {
    if (!validateSaving()) return

    if (currentType.value === 4) {
        if (localJoin.value.id) {
            const index = props.localTask.schema.join.findIndex((o) => o.id === localJoin.value.id)
            props.localTask.schema.join[index] = {
                ...localJoin.value,
                type: 'raw'
            }
        } else {
            props.localTask.schema.join.push({
                id: useHelper().generateId(),
                ...localJoin.value,
                type: 'raw'
            })
        }
    } else {
        const existingJoinIndex = props.localTask.schema.join.findIndex((o) => {
            return (
                o.by === localJoin.value.by &&
                o.to === localJoin.value.to &&
                o.byDatabaseName === localJoin.value.byDatabaseName &&
                o.toDatabaseName === localJoin.value.toDatabaseName
            )
        })

        if (existingJoinIndex !== -1) {
            props.localTask.schema.join[existingJoinIndex].list.concat(localJoin.value.list)
        } else {
            localJoin.value.id = useHelper().generateId()
            props.localTask.schema.join.push(cloneDeep(localJoin.value))
        }
    }

    emit('close')
}

onMounted(() => {
    defineOriginalTableList()
    defineLocalJoin()

    loadTablesFrom('left', 'byDatabaseName')
    loadTablesFrom('right', 'toDatabaseName')
})
</script>
