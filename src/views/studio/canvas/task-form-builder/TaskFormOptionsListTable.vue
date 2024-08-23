<template>
    <div class="task-form-options-list-table mt-2">
        <div class="control list-fields">
            <n-table
                class="table-sm table-striped table-bordered table"
                size="small"
            >
                <thead>
                    <tr>
                        <th
                            style="width: 25px; vertical-align: middle"
                            class="text-center"
                        />
                        <th>{{ $t('value') }}</th>
                        <th>{{ $t('label') }}</th>
                        <th
                            style="width: 25px; vertical-align: middle"
                            class="text-center"
                        >
                            <n-button
                                quaternary
                                size="tiny"
                                @click="addRow()"
                            >
                                <g-icon name="add" />
                            </n-button>
                        </th>
                    </tr>
                </thead>
                <tbody v-if="useFormStore().currentField.list.length <= 0">
                    <tr>
                        <td
                            colspan="4"
                            style="white-space: normal"
                        >
                            <g-alert
                                show-icon
                                :title="$t('formListInfo')"
                            />
                        </td>
                    </tr>
                </tbody>
                <vue-draggable
                    v-if="useFormStore().currentField.list?.length > 0"
                    v-model="useFormStore().currentField.list"
                    draggable=".tr-item"
                    item-key="id"
                    tag="tbody"
                    handle=".handle"
                >
                    <tr
                        v-for="(item, index) in useFormStore().currentField.list"
                        :key="index"
                        class="tr-item"
                    >
                        <td class="text-center">
                            <n-button
                                quaternary
                                size="tiny"
                                class="handle"
                            >
                                <g-icon name="handle" />
                            </n-button>
                        </td>
                        <td>
                            <n-input
                                v-model:value="item.value"
                                @blur="emitChanges"
                            />
                        </td>
                        <td>
                            <n-input
                                v-model:value="item.label"
                                @blur="emitChanges"
                            />
                        </td>
                        <td class="el-text-center">
                            <n-button
                                quaternary
                                size="tiny"
                                type="error"
                                @click="deleteRow(index)"
                            >
                                <g-icon name="delete" />
                            </n-button>
                        </td>
                    </tr>
                </vue-draggable>
            </n-table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getId } from '@gaio/utils'
import { onMounted } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useI18n } from 'vue-i18n'

import { useFormStore } from '@/stores'

const emitChanges = () => (useFormStore().refreshKey = getId())
const { t } = useI18n()

const addRow = () => {
    const length = useFormStore().currentField.list.length
    useFormStore().currentField.list = [
        ...useFormStore().currentField.list,
        {
            value: t('value') + length,
            label: t('label') + ' ' + length,
            default: false
        }
    ]
    emitChanges()
}

const deleteRow = (i: number) => {
    useFormStore().currentField.list.splice(i, 1)
    emitChanges()
}

onMounted(() => {
    useFormStore().currentField.list = useFormStore().currentField.list || [
        {
            value: t('value'),
            label: t('label'),
            default: false
        }
    ]
})
</script>
