<template>
	<NSelect
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
import { useAppStore } from '@/stores'
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
	appId?: string
	clearable?: boolean
	multiple?: boolean
	dataTypeFilter?: string[]
	required?: boolean
}>()

const formList = computed(() => {
	if (required || multiple) {
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
