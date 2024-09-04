<template>
	<NSelect
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
import { useAppStore } from '@/stores'
import type { ParamType } from '@gaio/shared/types'
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits(['update:modelValue', 'change'])
const {
	clearable = true,
	multiple = false,
	modelValue = undefined,
	required = false
} = defineProps<{
	modelValue?: string | string[]
	clearable?: boolean
	multiple?: boolean
	required?: boolean
}>()

const paramList = computed(() => {
	if (required || multiple) {
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
	() => modelValue,
	() => {
		if (selected.value !== modelValue) {
			selected.value = modelValue
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
