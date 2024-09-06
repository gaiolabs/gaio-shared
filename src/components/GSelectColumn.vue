<template>
	<NSelect
		v-model:value="selected"
		size="small"
		:options="columnList"
		:placeholder="$t('selectColumn')"
		:clearable="clearable"
		:multiple="multiple"
		:render-label="renderLabel"
		value-field="columnName"
		label-field="columnName"
		filterable
		@update:value="updateSelected"
	/>
</template>

<script setup lang="ts">
import VIcon from '@/components/GIcon.vue'
import useApi from '@/composables/useApi'
import useDataType from '@/composables/useDataType'
import { useAppStore } from '@/stores'
import type { FieldType } from '@gaio/shared/types'
import { NSelect, type SelectOption } from 'naive-ui'
import { h, onMounted, ref, type VNodeChild, watch } from 'vue'

type ColumnListType = {
	dataIcon: string
	type: string
} & SelectOption &
	FieldType

type DataTypeFilter = 'text' | 'json' | 'date' | 'array' | 'datetime' | 'uuid' | 'integer' | 'decimal'

const emit = defineEmits(['update:modelValue', 'change', 'loadColumnList'])
const {
	clearable = true,
	multiple = false,
	appId = undefined,
	modelValue = undefined,
	dataTypeFilter = []
} = defineProps<{
	modelValue?: string | string[]
	appId?: string
	clearable?: boolean
	multiple?: boolean
	dataTypeFilter?: DataTypeFilter[] & string[]
	tableName: string
}>()

const { dataTypeIcon, dataTypeName } = useDataType()

const selected = ref()
const renderLabel = (option: ColumnListType): VNodeChild => {
	return [
		option.dataIcon ?
			h(VIcon, {
				name: option.dataIcon,
				class: 'text-primary'
			})
		:	'',
		' ',
		option.columnName
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

const columnList = ref<ColumnListType[]>([])

const updateSelected = () => {
	emit('update:modelValue', selected.value)
	emit('change')
}

const loadColumnList = () => {
	const taskData = {
		...useAppStore().appInfo,
		tableName: tableName,
		sourceType: 'bucket',
		client: 'clickhouse'
	}

	if (appId) {
		taskData.appId = appId
	}

	useApi()
		.post('api/table/field', {
			body: {
				taskData
			}
		})
		.then((res) => {
			emit('loadColumnList', res.data)
			columnList.value = res.data
				.map((item: FieldType) => ({
					...item,
					dataIcon: dataTypeIcon(item.dataType),
					type: dataTypeName(item.dataType)
				}))
				.filter((item: ColumnListType) => !dataTypeFilter.length || dataTypeFilter.includes(item.type))
		})
}

onMounted(() => loadColumnList())
</script>
