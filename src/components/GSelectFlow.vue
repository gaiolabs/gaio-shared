<template>
	<n-select
		v-model:value="selected"
		size="small"
		:options="flowList"
		:placeholder="$t('selectFlow')"
		:clearable="clearable"
		:multiple="multiple"
		:render-label="renderLabel"
		value-field="flowId"
		label-field="flowName"
		filterable
		@update:value="updateSelected"
	/>
</template>

<script setup lang="ts">
import VIcon from '@/components/GIcon.vue'
import { useAppStore } from '@/stores'
import type { FlowType } from '@gaio/shared/types'
import { computed, h, ref, type VNodeChild, watch } from 'vue'
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

const flowList = computed(() => {
	if (props.required || props.multiple) {
		return useAppStore().flowList || []
	}

	return [
		{
			flowName: t('none'),
			flowId: undefined
		} as FlowType
	].concat(useAppStore().flowList || [])
})

const selected = ref()

const renderLabel = (option): VNodeChild => {
	if (!option.flowType) {
		return option.flowName
	}
	return [
		option.flowType === 'infoPub' ?
			h(VIcon, {
				color: '#e32',
				name: 'dashboard'
			})
		:	h(VIcon, {
				color: '#216ec9',
				name: 'flow'
			}),
		' ',
		option.flowName
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

const updateSelected = () => {
	emit('update:modelValue', selected.value)
	emit('change')
}
</script>
