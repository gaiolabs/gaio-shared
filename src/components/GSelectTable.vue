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
import { NSelect } from 'naive-ui'
import { onMounted, ref, watch } from 'vue'

const emit = defineEmits(['update:modelValue'])
const {
	clearable = true,
	multiple = false,
	appId = undefined,
	modelValue = undefined,
	disabled = false
} = defineProps<{
	modelValue?: string | string[]
	appId?: string
	clearable?: boolean
	multiple?: boolean
	disabled?: boolean
}>()

const selected = ref(modelValue)
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

	if (appId) {
		taskData.appId = appId
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
