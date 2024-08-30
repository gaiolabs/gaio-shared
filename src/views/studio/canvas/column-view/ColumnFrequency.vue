<template>
	<div class="g-bg-1 rounded p-1">
		<NSpin :show="loading">
			<NTable
				:single-column="false"
				:single-line="false"
				hoverable
				:bordered="false"
				size="small"
			>
				<thead>
					<tr>
						<th>{{ t('values') }}</th>
						<th class="!text-right">{{ t('rows') + ' (' + useColumnView().totalRows + ')' }}</th>
						<th class="!text-right">{{ t('rows') + ' (%)' }}</th>
						<th class="!text-right">{{ t('cumulated') + ' (%)' }}</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="item in frequencyList"
						:key="item.category"
					>
						<td :style="categoryCellStyleBasedOnPercent(item)">{{ item.category }}</td>
						<td class="!text-right">{{ item.qtd }}</td>
						<td class="!text-right">{{ item.percent }}</td>
						<td class="!text-right">{{ item.cumulated }}</td>
					</tr>
				</tbody>
			</NTable>
		</NSpin>
	</div>
</template>

<script setup lang="ts">
import useApi from '@/composables/useApi'
import useDataType from '@/composables/useDataType'
import { useAppStore, useAuthStore, useTableStore } from '@/stores'
import { useColumnView } from '@/views/studio/canvas/column-view/useColumnView'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

type FrequencyType = {
	category: string
	qtd: number
	percent: number
	cumulated: number
}

const { t } = useI18n()

const loading = ref(false)
const frequencyList = ref<FrequencyType[]>([])
const maxOccurrence = ref(0)

const categoryCellStyleBasedOnPercent = (record) => {
	const result = (record.qtd / maxOccurrence.value) * 100

	return {
		background: `linear-gradient(90deg, #A1D2FF 0%, #A1D2FF ${result}%, transparent ${result}%)`
	}
}

const loadFrequencyData = async () => {
	loading.value = true

	const frequencyResult = await useApi().post('api/table/frequency', {
		body: {
			taskData: {
				...useAppStore().task,
				limit: useAuthStore().user.options.tableFrequencyPageSize,
				columnName: columnName.value,
				totalRows: useColumnView().totalRows
			},
			filters: useTableStore().getFilter(useColumnView().localTask)
		}
	})

	maxOccurrence.value = frequencyResult.maxOccurrence
	frequencyList.value = frequencyResult.data.map((item) => {
		return {
			...item,
			percent: item.percent.toFixed(2),
			cumulated: item.cumulated.toFixed(2)
		}
	})

	loading.value = false
}

const columnName = computed(() => useColumnView().columnData.columnName)

watch(
	() => useAuthStore().user.options.tableFrequencyPageSize,
	() => loadFrequencyData()
)

watch(
	() => columnName.value,
	() => loadFrequencyData(),
	{ immediate: true }
)
</script>
