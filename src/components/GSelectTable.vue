<template>
	<NSelect
		v-model:value="selected"
		:options="tableList"
		:placeholder="$t('selectTable')"
		:clearable="clearable"
		:multiple="multiple"
		:disabled="disabled"
		filterable
	/>
</template>

<script setup lang="ts">
import useApi from '@/composables/useApi'
import { useAppStore } from '@/stores'
import { onMounted, ref, watch } from 'vue'

const emit = defineEmits(['update:modelValue'])
const props = withDefaults(
	defineProps<{
		modelValue?: string | string[]
		appId?: string
		clearable?: boolean
		multiple?: boolean
		disabled?: boolean
	}>(),
	{
		clearable: true,
		multiple: false,
		appId: undefined,
		modelValue: undefined,
		disabled: false
	}
)

const selected = ref(props.modelValue)
const tableList = ref([])

watch(
	() => selected.value,
	() => emit('update:modelValue', selected.value)
)

const loadTableList = () => {
	const taskData = {
		...useAppStore().appInfo,
		sourceType: 'bucket',
		client: 'clickhouse'
	}

	if (props.appId) {
		taskData.appId = props.appId
	}

	useApi()
		.post('api/table/list', {
			body: {
				taskData
			}
		})
		.then((res) => (tableList.value = res.data.map((item) => ({ label: item.tableName, value: item.tableName }))))
}

onMounted(() => loadTableList())
</script>
