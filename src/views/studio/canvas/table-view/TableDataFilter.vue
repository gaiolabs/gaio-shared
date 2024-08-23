<template>
    <div class="table-data-filter flex-grow">
        <div class="table-data-filter flex gap-3">
            <div
                v-for="(filter, filterIndex) of localFilter"
                :key="filterIndex"
                class="flex flex-grow flex-col"
            >
                <div
                    v-for="(item, itemIndex) of filter.list"
                    :key="itemIndex"
                    class="mb-1 flex flex-grow gap-2"
                >
                    <div
                        v-if="localFilter[0].list.length > 1"
                        class="flex items-center"
                    >
                        <n-switch
                            v-model:value="item.selected"
                            :round="false"
                        />
                    </div>
                    <div
                        v-if="localFilter[0].list.length > 1"
                        class="flex w-[55px] items-center"
                    >
                        <n-button
                            v-if="itemIndex > 0"
                            v-model:value="item.andOr"
                            block
                            @click="changeLogicOperator(item)"
                        >
                            {{ item.andOr }}
                        </n-button>
                    </div>
                    <div>
                        <n-select
                            v-model:value="item.columnName"
                            filterable
                            :options="columns"
                            value-field="columnName"
                            label-field="columnName"
                            @update:value="changeFilter()"
                        />
                    </div>
                    <div>
                        <n-select
                            v-model:value="item.operator"
                            filterable
                            :options="operators(item)"
                        />
                    </div>
                    <div class="flex-grow">
                        <n-input
                            v-model:value="item.value"
                            @update:value="changeFilter()"
                            @keyup.enter="applyFilter('current', itemIndex)"
                        />
                    </div>
                    <div class="flex gap-2">
                        <n-button
                            tertiary
                            @click="applyFilter('current', itemIndex)"
                        >
                            {{ $t('apply') }}
                        </n-button>
                        <n-button
                            tertiary
                            @click="removeFilter(itemIndex)"
                        >
                            <template #icon>
                                <g-icon name="close" />
                            </template>
                        </n-button>
                        <n-button
                            tertiary
                            @click="addFilter(itemIndex)"
                        >
                            <template #icon>
                                <g-icon name="plus" />
                            </template>
                        </n-button>
                    </div>
                </div>
                <div></div>
            </div>
        </div>
        <div
            class="g-bg-2 g-border-300 mt-2 flex items-center justify-between gap-1 rounded p-1"
            :class="{ '': localFilter[0].list.length > 1 }"
        >
            <div class="flex items-center justify-center gap-3 px-2">
                <div>{{ columns.length }} {{ $t('columns') }}</div>
                <n-divider vertical />
                <div>{{ defaultFormatNumeric(totalRows) }} {{ $t('rows') }}</div>
                <template v-if="filterDirty">
                    <n-divider vertical />
                    <div>
                        <g-icon name="filter" />
                        {{ defaultFormatNumeric(totalRowsFiltered) }} {{ $t('filtered') }}
                    </div>
                </template>
            </div>
            <div
                v-if="localFilter[0].list.length > 1"
                class="w-[170px]"
            >
                <n-button
                    block
                    type="primary"
                    @click="applyFilter('selected')"
                >
                    {{ $t('applySelected') }}
                </n-button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { BuilderTaskType, FieldType, SchemaFilterType } from '@gaio/types'
import { getId } from '@gaio/utils'
import { cloneDeep } from 'lodash-es'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import useDataType from '@/composables/useDataType'
import useFormatValue from '@/composables/useFormatValue'
import useHelper from '@/composables/useHelper'
import { useTableStore } from '@/stores'

const { defaultFormatNumeric } = useFormatValue()

const { dataTypeName } = useDataType()
const { operatorsFilters } = useHelper()
const { t } = useI18n()

const emit = defineEmits(['loadFilter'])
const props = defineProps<{
    localTask: BuilderTaskType
    totalRows: number
    totalRowsFiltered: number
    columns: FieldType[]
}>()

const filterDirty = computed(() => localFilter.value[0].list.length > 1)

const removeFilter = (itemIndex: number) => {
    if (itemIndex === 0 && localFilter.value[0].list.length === 1) {
        localFilter.value = [
            {
                list: [],
                operator: '=',
                andOr: 'and'
            }
        ]
        applyFilter('selected')
        addFilter(0)
    } else {
        localFilter.value[0].list.splice(itemIndex, 1)
    }
}

const localFilter = ref<SchemaFilterType[]>([
    {
        list: [],
        operator: '=',
        andOr: 'and'
    }
])

const changeFilter = () => {}

const changeLogicOperator = (item) => {
    item.andOr = item.andOr === 'and' ? 'or' : 'and'
}

const applyFilter = (type: 'selected' | 'current', currentIndex?: number) => {
    const reserveFilter = cloneDeep(localFilter.value)
    switch (type) {
        case 'selected':
            reserveFilter[0].list = localFilter.value[0].list.filter((f) => f.selected)
            break
        case 'current':
            reserveFilter[0].list = localFilter.value[0].list.filter((_, i) => i === currentIndex)
            break
    }

    useTableStore().defineFilter(props.localTask, reserveFilter)

    filterDirty.value = true

    emit('loadFilter', reserveFilter)
}

const addFilter = (atIndex: number) => {
    localFilter.value[0].list.splice(atIndex + 1, 0, {
        columnName: props.columns[0].columnName,
        tableName: props.columns[0].tableName,
        databaseName: props.columns[0].databaseName,
        andOr: 'and',
        operator: '=',
        type: 'value',
        selected: true,
        value: null,
        id: getId()
    })
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

onMounted(() => {
    localFilter.value = useTableStore().getFilter(props.localTask)
    if (localFilter.value[0].list.length === 0) {
        addFilter(0)
    }
})
</script>
