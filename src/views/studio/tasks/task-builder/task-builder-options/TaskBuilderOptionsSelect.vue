<template>
	<div class="task-builder-field-options p-1">
		<div class="rounded-[8px] bg-elevation-1 p-2">
			<div class="mx-1 mb-1">
				{{ $t('alias') }}
			</div>
			<NInput
				v-model:value="localField.field.alias"
				v-alpha
				size="small"
				:placeholder="$t('typeHere')"
				class="mb-2"
			/>
			<div class="flex gap-2">
				<div class="grow">
					<NSelect
						v-model:value="localField.field.dataType"
						size="small"
						:options="dataTypeList"
					/>
				</div>
				<div
					v-if="dataTypeIsFloat(localField.field.dataType)"
					class="w-[80px]"
				>
					<NInputNumber
						v-model:value="localField.field.columnLength"
						size="small"
						:min="1"
						:max="10"
						:step="1"
					/>
				</div>
			</div>
		</div>
		<div class="my-2 rounded-[8px] bg-elevation-1 p-2">
			<NRadioGroup
				v-model:value="localFieldType"
				@change="defineTypeBasedOnAggregations()"
			>
				<NRadio
					v-for="item in fieldValueType"
					:key="item.value"
					class="w-full py-1"
					:value="item.value"
					:label="$t(item.label)"
				/>
			</NRadioGroup>
		</div>

		<div
			v-if="!localTask.tableView"
			class="mt-2"
		>
			<NList
				bordered
				class="bg-elevation-1"
			>
				<NListItem class="!p-2 font-bold">{{ $t('advanced') }}</NListItem>
				<NListItem class="!p-2">
					<div class="flex items-center justify-between">
						{{ $t('orderByOnCreation') }}
						<NSwitch
							v-model:value="localField.field.createOrderBy"
							size="small"
						/>
					</div>
				</NListItem>
				<NListItem>
					<div class="flex items-center justify-between">
						{{ $t('primaryKey') }}
						<NSwitch
							v-model:value="localField.field.primaryKey"
							size="small"
						/>
					</div>
				</NListItem>
			</NList>
		</div>
	</div>
</template>

<script setup lang="ts">
import useDataType from '@/composables/useDataType'
import type { BuilderTaskType, FieldType } from '@gaio/shared/types'
import { cloneDeep } from 'lodash-es'
import { type PropType, ref, onMounted, computed } from 'vue'

const props = defineProps({
	localField: {
		type: Object as PropType<{
			type: string
			field: Partial<FieldType>
		}>,
		required: true,
		default: () => ({}) as { type: string; field: Partial<FieldType> }
	},
	localTask: {
		type: Object as PropType<BuilderTaskType>,
		required: true,
		default: () => null as BuilderTaskType
	}
})

const localFieldType = ref('value')
const backupLocalField = ref<FieldType>({})

const { dataTypeIsNumeric, dataTypeIsDate, dataTypeIsFloat, dataTypeLabel } = useDataType()

const dataTypeList = [
	'Nullable(String)',
	'Nullable(Int64)',
	'Nullable(Float64)',
	'Nullable(Date)',
	'Nullable(DateTime)',
	'Array',
	'JSON'
].map((o) => ({
	label: dataTypeLabel(o),
	value: o
}))
const fieldValueType = computed(() =>
	[
		{
			label: 'value',
			value: 'value',
			in: ['all']
		},
		{
			label: 'distinct',
			value: 'distinct',
			in: ['all']
		},
		{
			label: 'sum',
			value: 'sum',
			in: ['numeric', 'date']
		},
		{
			label: 'avg',
			value: 'avg',
			in: ['numeric', 'date']
		},
		{
			label: 'min',
			value: 'min',
			in: ['numeric', 'date']
		},
		{
			label: 'max',
			value: 'max',
			in: ['numeric', 'date']
		},
		{
			label: 'count',
			value: 'count',
			in: ['all']
		},

		{
			label: 'avgDistinct',
			value: 'avgDistinct',
			in: ['numeric', 'date']
		},
		{
			label: 'sumDistinct',
			value: 'sumDistinct',
			in: ['numeric', 'date']
		},
		{
			label: 'countDistinct',
			value: 'countDistinct',
			in: ['all']
		},
		{
			label: 'sumPercent',
			value: 'sumPercent',
			in: ['numeric']
		},
		{
			label: 'countPercent',
			value: 'countPercent',
			in: ['all']
		},
		{
			label: 'stdDevSamp',
			value: 'stdDevSamp',
			in: ['numeric']
		},
		{
			label: 'stdDevPop',
			value: 'stdDevPop',
			in: ['numeric']
		},
		{
			label: 'firstValue',
			value: 'any',
			in: ['all']
		},
		{
			label: 'lastValue',
			value: 'anyLast',
			in: ['all']
		},
		{
			label: 'anyHeavy',
			value: 'anyHeavy',
			in: ['all']
		}
	].filter((o) => {
		if (o.in.includes('all')) {
			return true
		}

		if (o.in.includes('numeric') && dataTypeIsNumeric(props.localField.field.dataType)) {
			return true
		}

		return o.in.includes('date') && dataTypeIsDate(props.localField.field.dataType)
	})
)

const defineTypeBasedOnAggregations = () => {
	switch (localFieldType.value) {
		case 'distinct':
			props.localField.field.type = 'value'
			props.localField.field.distinct = true
			break
		default:
			props.localField.field.type = localFieldType.value
			props.localField.field.distinct = false
			break
	}

	props.localField.field.alias = undefined

	if (props.localField.field.type !== 'value') {
		props.localField.field.alias = `${props.localField.field.type}_${props.localField.field.columnName}`
	} else {
		props.localField.field.alias = props.localField.field.columnName
	}

	if (props.localField.field.type === 'value') {
		props.localField.field.dataType = backupLocalField.value.dataType
	} else {
		if (localFieldType.value !== 'any' && localFieldType.value !== 'anyLast') {
			if (localFieldType.value === 'count' || localFieldType.value === 'countDistinct') {
				props.localField.field.dataType = 'Nullable(Int64)'
			} else if (backupLocalField.value.dataType?.includes('Date') && ['max', 'min'].includes(localFieldType.value)) {
				props.localField.field.dataType = backupLocalField.value.dataType
			} else if (
				props.localField.field.dataType?.includes('Float') ||
				props.localField.field.dataType?.includes('Dec')
			) {
				props.localField.field.dataType = 'Nullable(Float64)'
				props.localField.field.columnLength = 2
			} else if (props.localField.field.dataType?.includes('Int')) {
				if (
					['avg', 'avgDistinct', 'countPercent', 'sumPercent', 'stdDevSamp', 'stdDevPop'].includes(localFieldType.value)
				) {
					props.localField.field.dataType = 'Nullable(Float64)'
					props.localField.field.columnLength = 2
				} else {
					props.localField.field.dataType = 'Nullable(Int64)'
				}
			} else {
				props.localField.field.dataType = 'Nullable(Float64)'
				props.localField.field.columnLength = 2
			}
		} else if (localFieldType.value === 'any' || localFieldType.value === 'anyLast') {
			props.localField.field.dataType = backupLocalField.value.dataType
		}
	}
}

onMounted(() => {
	backupLocalField.value = cloneDeep(props.localField.field)
})
</script>
