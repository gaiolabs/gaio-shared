<template>
	<g-dialog
		:show="showModal"
		@close="close()"
	>
		<template #title>
			<div class="flex w-full items-start justify-between gap-1">
				<div class="grow">
					<g-icon :name="dataTypeIcon(columnData.dataType)" />
					{{ columnData.columnName }}
				</div>
				<div class="flex items-center justify-between gap-1">
					<NSelect
						v-if="columnData"
						v-model:value="useAuthStore().user.options.tableFrequencyPageSize"
						class="min-w-[150px]"
						size="tiny"
						:options="numberOfRows"
					/>
				</div>
			</div>
		</template>
		<template #tabs>
			<div class="column-view w-full">
				<NTabs
					pane-class="g-bg-0"
					size="small"
					type="line"
					:default-value="currentTab"
				>
					<NTabPane
						name="frequency"
						:tab="$t('frequency')"
						display-directive="show:lazy"
					>
						<div class="w-full p-4">
							<column-extra
								v-if="isTextOrIsDate"
								class="mb-2"
							/>
							<column-frequency :key="useAuthStore().user.options.tableFrequencyPageSize" />
						</div>
					</NTabPane>
					<NTabPane
						v-if="isNumeric"
						display-directive="show:lazy"
						name="stats"
						:tab="$t('stats')"
					>
						<column-stats class="m-4" />
					</NTabPane>
					<NTabPane
						v-if="isNumeric"
						display-directive="show:lazy"
						name="histogram"
						:tab="$t('histogram')"
					>
						<column-histogram class="m-4" />
					</NTabPane>
				</NTabs>
			</div>
		</template>
	</g-dialog>
</template>

<script setup lang="ts">
import useApi from '@/composables/useApi'
import useDataType from '@/composables/useDataType'
import { useAppStore, useAuthStore } from '@/stores'
import ColumnExtra from '@/views/studio/tasks/column-view/ColumnExtra.vue'
import ColumnFrequency from '@/views/studio/tasks/column-view/ColumnFrequency.vue'
import ColumnHistogram from '@/views/studio/tasks/column-view/ColumnHistogram.vue'
import ColumnStats from '@/views/studio/tasks/column-view/ColumnStats.vue'
import { useColumnView } from '@/views/studio/tasks/column-view/useColumnView'
import { computed, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { columnData, totalRows } = useColumnView().$state
const emit = defineEmits(['close'])

const close = () => {
	showModal.value = false
	emit('close')
}

const showModal = ref(true)
type FrequencyType = {
	category: string
	qtd: number
	percent: number
	cumulated: number
}

const numberOfRows = [10, 20, 30, 50, 100, 200, 500, 1000].map((o) => {
	return {
		label: o + ` ${t('categories')}`,
		value: o
	}
})

const { dataTypeIsText, dataTypeIsDate, dataTypeIsDateTime, dataTypeIsNumeric, dataTypeIcon } = useDataType()
const loading = ref(false)
const frequencyList = ref<FrequencyType[]>([])
const task = computed(() => {
	return useAppStore().task
})

const isNumeric = computed(() => {
	return dataTypeIsNumeric(columnData.dataType)
})

const isTextOrIsDate = computed(() => {
	if (columnData) {
		return (
			dataTypeIsText(columnData.dataType) ||
			dataTypeIsDate(columnData.dataType) ||
			dataTypeIsDateTime(columnData.dataType)
		)
	}
	return false
})

const currentTab = ref('frequency')

const loadFrequencyData = async () => {
	loading.value = true
	const frequencyResult = await useApi().post('api/table/frequency', {
		body: {
			taskData: {
				...task.value,
				columnName: columnData.columnName,
				totalRows: totalRows
			}
		}
	})

	frequencyList.value = frequencyResult.data
	loading.value = false
}

const loadDataBasedOnType = () => {
	if (isTextOrIsDate.value) {
		loadFrequencyData()
	}
}

onBeforeMount(() => {
	if (isTextOrIsDate.value) {
		currentTab.value = 'frequency'
	} else {
		currentTab.value = 'stats'
	}
	loadDataBasedOnType()
})
</script>
