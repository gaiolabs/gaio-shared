<template>
    <n-select
        v-model:value="selected"
        size="small"
        :options="paramList"
        :placeholder="$t('selectParam')"
        :clearable="clearable"
        :multiple="multiple"
        filterable
        @update:value="updateSelected"
    />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import { useAppStore } from '@/stores'
import { useI18n } from 'vue-i18n'
import type { ParamType } from '@gaio/types'

const { t } = useI18n()

const emit = defineEmits(['update:modelValue', 'change'])
const props = withDefaults(
    defineProps<{
        modelValue?: string | string[]
        appId?: string
        clearable?: boolean
        multiple?: boolean
        dataTypeFilter?: string[]
        required?: boolean
    }>(),
    {
        clearable: true,
        multiple: false,
        appId: undefined,
        modelValue: undefined,
        required: false,
        dataTypeFilter: () => []
    }
)

const paramList = computed(() => {
    if (props.required || props.multiple) {
        return useAppStore().params || []
    }

    const paramList = (useAppStore().params || []).map((param) => ({
        value: param.paramName,
        label: param.paramName
    }))

    return [
        {
            label: t('none'),
            value: undefined
        } as ParamType
    ].concat(paramList)
})

const selected = ref()

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

const updateSelected = () => {
    emit('update:modelValue', selected.value)
    emit('change')
}
</script>
