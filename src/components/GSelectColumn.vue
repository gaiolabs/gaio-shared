<template>
    <n-select v-model:value="selected" size="small" :options="columnList" :placeholder="$t('selectColumn')"
        :clearable="clearable" :multiple="multiple" :render-label="renderLabel" value-field="columnName"
        label-field="columnName" filterable @update:value="updateSelected" />
</template>

<script setup lang="ts">
import type { FieldType } from '@gaio/shared/types'
import type { SelectOption } from 'naive-ui'
import { h, onMounted, ref, type VNodeChild, watch } from 'vue'

import VIcon from '@/components/GIcon.vue'
import useApi from '@/composables/useApi'
import useDataType from '@/composables/useDataType'
import { useAppStore } from '@/stores'

type ColumnListType = {
    dataIcon: string
    type: string
} & SelectOption &
    FieldType

type DataTypeFilter = 'text' | 'json' | 'date' | 'array' | 'datatime' | 'uuid' | 'integer' | 'decimal'

const emit = defineEmits(['update:modelValue', 'change', 'loadColumnList'])
const props = withDefaults(
    defineProps<{
        modelValue?: string | string[]
        appId?: string
        clearable?: boolean
        multiple?: boolean
        dataTypeFilter?: DataTypeFilter[] & string[]
        tableName: string
    }>(),
    {
        clearable: true,
        multiple: false,
        appId: undefined,
        modelValue: undefined,
        dataTypeFilter: () => []
    }
)

const { dataTypeIcon, dataTypeName } = useDataType()

const selected = ref()
const renderLabel = (option: ColumnListType): VNodeChild => {
    return [
        option.dataIcon ?
            h(VIcon, {
                name: option.dataIcon,
                class: 'text-primary'
            })
            : '',
        ' ',
        option.columnName
    ]
}

watch(
    () => props.modelValue,
    () => {
        if (selected.value !== props.modelValue) {
            selected.value = props.modelValue
        }
    },
    {
        immediate: true
    }
)

const columnList = ref<ColumnListType[]>([])

const updateSelected = () => {
    emit('update:modelValue', selected.value)
    emit('change')
}

const loadColumnList = () => {
    const taskData = {
        ...useAppStore().appInfo,
        tableName: props.tableName,
        sourceType: 'bucket',
        client: 'clickhouse'
    }

    if (props.appId) {
        taskData.appId = props.appId
    }

    useApi()
        .post('api/table/field', {
            body: {
                taskData
            }
        })
        .then((res) => {
            emit('loadColumnList', res.data)
            columnList.value = res.data
                .map((item: FieldType) => ({
                    ...item,
                    dataIcon: dataTypeIcon(item.dataType),
                    type: dataTypeName(item.dataType)
                }))
                .filter(
                    (item: ColumnListType) => !props.dataTypeFilter.length || props.dataTypeFilter.includes(item.type)
                )
        })
}

onMounted(() => loadColumnList())
</script>
