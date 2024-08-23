<template>
    <n-select
        v-model:value="selected"
        size="small"
        :options="formList"
        :placeholder="$t('selectForm')"
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

const formList = computed(() => {
    if (props.required || props.multiple) {
        return useAppStore().forms || []
    }

    const formListBase = (useAppStore().forms || []).map((f) => ({
        value: f.formId,
        label: f.formName
    }))

    return [
        {
            label: t('none'),
            value: undefined
        }
    ].concat(formListBase)
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
