<template>
	<div class="table-columns g-bg-1 rounded p-2">
		<NTable
			striped
			class="w-full"
			size="small"
		>
			<thead>
				<tr>
					<th class="w-[40px]"></th>
					<th>{{ t('column') }}</th>
					<th>{{ t('type') }}</th>
					<th>{{ t('dataType') }}</th>
					<th v-if="localTask.client !== 'clickhouse'">{{ t('pureType') }}</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="item in localData"
					:key="item.columnName"
				>
					<td class="!text-center">
						<g-data-type-icon :data-type="item.dataType" />
					</td>
					<td>{{ item.columnName }}</td>
					<td>{{ item.dataTypeName }}</td>
					<td>{{ item.dataType }}</td>
					<td v-if="localTask.client !== 'clickhouse'">{{ item.pureType }}</td>
				</tr>
			</tbody>
		</NTable>
	</div>
</template>

<script setup lang="ts">
import GDataTypeIcon from '@/components/GDataTypeIcon.vue'
import useDataType from '@/composables/useDataType'
import type { BuilderTaskType, FieldType } from '@gaio/shared/types'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['load'])

const { t } = useI18n()
const { dataTypeIcon, dataTypeName } = useDataType()

const props = defineProps<{
	localTask: BuilderTaskType
	columns: FieldType[]
	loading: boolean
}>()

const localData = computed(() => {
	return props.columns.map((item) => {
		return {
			...item,
			columnName: item.columnName,
			dataType: item.dataType,
			dataTypeIcon: dataTypeIcon(item.dataType),
			dataTypeName: t(dataTypeName(item.dataType))
		}
	})
})

watch(
	() => props.columns,
	() => emit('load', false),
	{ immediate: true }
)
</script>
