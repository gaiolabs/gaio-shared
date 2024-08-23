<template>
    <div
        v-if="localValue"
        class="g-define-column w-full"
    >
        <div class="flex gap-2">
            <div class="grow">
                <n-input
                    v-model:value="localValue.columnName"
                    clearable
                    size="small"
                    :placeholder="$t('columnName')"
                    @blur="updateSelected"
                />
            </div>
            <div class="flex gap-2">
                <div class="min-w-[120px]">
                    <n-select
                        v-model:value="localValue.dataType"
                        class="w-full"
                        size="small"
                        :options="dataTypeListOptions"
                        @update:value="updateSelected"
                    />
                </div>
                <div v-if="dataTypeIsFloat(localValue.dataType)">
                    <n-input-number
                        v-model:value="localValue.columnLength"
                        size="small"
                        :placeholder="$t('size')"
                        :min="1"
                        :max="10"
                        :step="1"
                        @blur="updateSelected"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import useDataType from '@/composables/useDataType'
import { watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FieldType, GenericType } from '@gaio/types'

const { t } = useI18n()

const emit = defineEmits(['update:modelValue'])
const props = withDefaults(
    defineProps<{
        modelValue?: FieldType & GenericType
    }>(),
    {
        modelValue: undefined,
        dataTypeFilter: () => []
    }
)

const { dataTypeIsFloat, dataTypeList, dataTypeLabel } = useDataType()
const localValue = ref()

watch(
    () => props.modelValue,
    () => {
        if (localValue.value !== props.modelValue) {
            localValue.value = props.modelValue
        }
    },
    {
        immediate: true
    }
)

const updateSelected = () => {
    emit('update:modelValue', localValue.value)
}

const dataTypeListOptions = [
    {
        label: t('none'),
        value: ''
    }
].concat(
    dataTypeList.map((o) => ({
        label: dataTypeLabel(o),
        value: o
    }))
)
</script>
