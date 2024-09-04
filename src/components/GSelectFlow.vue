<template>
	<NSelect
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

const flowList = computed(() => {
	if (required || multiple) {
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
