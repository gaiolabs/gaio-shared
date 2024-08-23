<template>
    <div class="task-meta-field">
        <div v-if="!localMeta?.tableName">
            <g-alert :title="$t('selectTable')" />
        </div>
        <div
            v-else
            class="canvas-task-power-search-metadata"
        >
            <div v-if="localMeta">
                <div class="flex gap-2">
                    <n-input
                        v-model:value="searchTerm"
                        clearable
                        :placeholder="$t('search')"
                    />
                    <n-button
                        type="primary"
                        @click="loadFields"
                    >
                        {{ $t('reset') }}
                    </n-button>
                </div>

                <div class="g-card my-2 p-2">
                    <vue-draggable
                        v-model="localMeta.fields"
                        :group="{ name: 'sources', pull: false, put: true }"
                        target="tbody"
                        handle=".handle"
                    >
                        <n-table
                            striped
                            sm
                            class="w-full"
                        >
                            <thead>
                                <tr class="tr-item">
                                    <th
                                        style="width: 20px"
                                        class="text-center"
                                    />
                                    <th
                                        style="width: 20px"
                                        class="text-center"
                                    >
                                        <n-tooltip placement="top">
                                            <template #trigger>
                                                <g-icon name="hidden" />
                                            </template>
                                            {{ $t('hidden') }}
                                        </n-tooltip>
                                    </th>
                                    <th>{{ $t('default') }}</th>
                                    <th colspan="2">{{ $t('name') }}</th>
                                    <th>{{ $t('title') }}</th>
                                    <th style="width: 150px">{{ $t('format') }}</th>
                                    <th style="width: 150px"></th>
                                    <th style="width: 150px"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="field of $filterBy(localMeta.fields, '', searchTerm) as FieldType[]"
                                    :key="field.columnName"
                                >
                                    <td class="el-cursor text-center">
                                        <g-icon
                                            name="handle"
                                            class="handle"
                                        />
                                    </td>
                                    <td class="text-center">
                                        <n-checkbox v-model:checked="field.hidden" />
                                    </td>
                                    <td style="width: 180px">
                                        <n-select
                                            v-if="!dataTypeIsDate(field.dataType)"
                                            v-model:value="field.type"
                                            :options="[
                                                { label: $t('value'), value: 'value' },
                                                { label: $t('count'), value: 'count' },
                                                { label: $t('countDistinct'), value: 'countDistinct' },
                                                { label: $t('sum'), value: 'sum' },
                                                { label: $t('avg'), value: 'avg' },
                                                { label: $t('max'), value: 'max' },
                                                { label: $t('min'), value: 'min' }
                                            ]"
                                        />
                                        <n-select
                                            v-else
                                            v-model:value="field.groupDateBy"
                                            :options="dateValues"
                                        />
                                    </td>
                                    <td style="width: 20px">
                                        <g-data-type-icon :data-type="field.dataType" />
                                    </td>
                                    <td style="white-space: nowrap">
                                        {{ field.columnName }}
                                    </td>
                                    <td style="width: 180px">
                                        <n-input
                                            v-model:value="field.title"
                                            :placeholder="$t('title')"
                                        />
                                    </td>
                                    <td>
                                        <n-select
                                            v-model:value="field.formatType"
                                            :options="[
                                                { label: $t('none'), value: 'none' },
                                                { label: $t('decimal'), value: 'decimal' },
                                                { label: $t('percentage'), value: 'percentage' }
                                            ]"
                                        />
                                    </td>
                                    <td>
                                        <span v-if="field.formatType !== 'date'">
                                            <n-select
                                                v-model:value="field.separators"
                                                :options="[
                                                    { label: $t('none'), value: 'none' },
                                                    { label: $t('noneComma'), value: 'noneComma' },
                                                    { label: $t('noneDot'), value: 'noneDot' },
                                                    { label: $t('commaDot'), value: 'commaDot' },
                                                    { label: $t('dotComma'), value: 'dotComma' }
                                                ]"
                                            />
                                        </span>
                                    </td>
                                    <td>
                                        <span v-if="field.formatType !== 'date'">
                                            <n-input-number v-model:value="field.formatDecimalSize" />
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </n-table>
                    </vue-draggable>
                </div>
                <div>
                    <div class="mb-1">
                        {{ $t('user') }} {{ $t('filter').toLowerCase() }} {{ $t('column').toLowerCase() }}
                    </div>
                    <n-select
                        v-model="localMeta.userFilter"
                        :options="[{ columnName: $t('none'), value: '' }].concat(localMeta.fields)"
                        value-field="columnName"
                        label-field="columnName"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { FieldType, MetaType } from '@gaio/types'
import { onMounted, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useI18n } from 'vue-i18n'

import useApi from '@/composables/useApi'
import useDataType from '@/composables/useDataType'
import useFormatValue from '@/composables/useFormatValue'
import { useAppStore } from '@/stores'

const props = withDefaults(defineProps<{ localMeta: MetaType }>(), {
    localMeta: null
})
const { dataTypeIsDate, dataTypeIsNumeric, dataTypeIsFloat } = useDataType()
const { defaultUserSeparator } = useFormatValue()

const { t } = useI18n()
const searchTerm = ref('')

const dateValues = [
    'year',
    'semester',
    'quarter',
    'month',
    'week',
    'day',
    'dateHour',
    'dateHourMinute',
    'dateHourMinuteSecond'
].map((value) => {
    return {
        label: t(`${value}`),
        value
    }
})

const loadFields = () => {
    useApi()
        .post('api/table/field', {
            body: {
                taskData: {
                    ...useAppStore().appInfo,
                    tableName: props.localMeta.tableName,
                    client: 'clickhouse'
                }
            }
        })
        .then((response: { data: FieldType[] }) => {
            props.localMeta.fields = response.data.map((field) => {
                field.title = field.columnName
                if (dataTypeIsDate(field.dataType)) {
                    field.type = 'value'
                    field.groupDateBy = 'month'
                } else if (dataTypeIsFloat(field.dataType)) {
                    field.type = 'sum'
                    field.formatType = 'decimal'
                    field.formatDecimalSize = 2
                    field.separators = defaultUserSeparator
                } else if (dataTypeIsNumeric(field.dataType)) {
                    field.type = 'sum'
                    field.formatType = 'decimal'
                    field.formatDecimalSize = 0
                    field.separators = defaultUserSeparator
                } else {
                    field.type = 'value'
                    field.formatType = 'none'
                }
                return field
            })
        })
}

onMounted(() => {
    if (props.localMeta.fields.length === 0) {
        loadFields()
    }
})
</script>
