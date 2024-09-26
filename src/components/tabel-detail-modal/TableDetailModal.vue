<template>
	<NModal
		:show="openModal"
		class="w-[100vw] h-full min-h-[100vh] top-0 left-0 flex flex-col"
		preset="card"
		:mask-closable="false"
		:block-scroll="true"
		@update:show="handleModalVisibility"
	>
		<template #header>
			<div class="flex w-full items-center justify-between gap-3">
				<div class="flex flex-grow items-center gap-3">
					<div class="flex items-center gap-2 font-semibold">
						<GIcon name="table" />
						{{ tableName }}
					</div>
					<NDivider vertical />
					<NButtonGroup size="small">
						<NButton
							strong
							secondary
							:type="showTab === 'data' ? 'primary' : 'default'"
							@click="showTab = 'data'"
						>
							{{ $t('data') }}
						</NButton>
						<NButton
							strong
							secondary
							:type="showTab === 'columns' ? 'primary' : 'default'"
							@click="showTab = 'columns'"
						>
							{{ $t('columns') }}
						</NButton>
						<NButton
							strong
							secondary
							:type="showTab === 'stats' ? 'primary' : 'default'"
							@click="showTab = 'stats'"
						>
							{{ $t('stats') }}
						</NButton>
						<NButton
							strong
							secondary
							:type="showTab === 'frequency' ? 'primary' : 'default'"
							@click="showTab = 'frequency'"
						>
							{{ $t('frequency') }}
						</NButton>
					</NButtonGroup>
				</div>
				<div class="me-3 flex gap-3">
					<NButton
						v-if="showTab === 'data'"
						strong
						secondary
						@click="refreshData(true)"
					>
						{{ $t('refresh') }}
					</NButton>
					<div
						v-if="['data', 'frequency'].includes(showTab)"
						class="w-[140px]"
					>
						<NSelect
							v-model:value="itemsPerPage"
							:options="itemsPerPageList"
							@update:value="changePageSizeAndRefresh"
						/>
					</div>
				</div>
			</div>
		</template>
		<template #default>
			<div
				v-if="columns.length"
				ref="content"
				class="table-view table-view-content w-100 px-3 py-2 flex flex-wrap flex-col"
			>
				<NScrollbar>
					<div v-if="showTab === 'data'">
						<TableData
							v-if="columns.length"
							:key="localKey"
							:local-task="localTask"
							:columns="columns"
							:loading="loading"
							:total-rows="totalRows"
							:items-per-page="itemsPerPage"
							@load="loading = $event"
							@select-column="selectColumn"
						/>
					</div>
					<div v-if="showTab === 'columns'">
						<TableColumns
							:columns="columns"
							:local-task="localTask"
							:loading="loading"
							@load="loading = $event"
							@select-column="selectColumn"
						/>
					</div>
					<div v-if="showTab === 'stats'">
						<TableStats
							:columns="columns"
							:local-task="localTask"
							:total-rows="totalRows"
							:loading="loading"
							@load="loading = $event"
						/>
					</div>
					<div v-if="showTab === 'frequency'">
						<TableFrequency
							:local-task="localTask"
							:columns="columns"
							:total-rows="totalRows"
							:loading="loading"
						/>
					</div>
				</NScrollbar>
			</div>
			<GAlert
				v-else-if="!loading"
				:title="$t('missingTable')"
			/>
			<template v-if="showTableInfo">
				<ColumnView @close="showTableInfo = false" />
			</template>
		</template>
	</NModal>
</template>

<script setup lang="ts">
import GAlert from '@/components/GAlert.vue'
import GIcon from '@/components/GIcon.vue'
import { defaultSchema } from '@/composables/default-task/defaultSchema'
import useApi from '@/composables/useApi'
import useDefault from '@/composables/useDefault'
import { useAppStore, useAuthStore, useTableStore } from '@/stores'
import ColumnView from '@/views/studio/canvas/column-view/ColumnView.vue'
import { useColumnView } from '@/views/studio/canvas/column-view/useColumnView'
import TableColumns from '@/views/studio/canvas/table-view/TableColumns.vue'
import TableData from '@/views/studio/canvas/table-view/TableData.vue'
import TableFrequency from '@/views/studio/canvas/table-view/TableFrequency.vue'
import TableStats from '@/views/studio/canvas/table-view/TableStats.vue'
import type { BuilderTaskType, FieldType } from '@gaio/shared/types'
import { NButton, NButtonGroup, NDivider, NModal, NScrollbar, NSelect } from 'naive-ui'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

type LocalFieldType = { width?: number } & FieldType
const { openModal = false, tableName = null } = defineProps<{
	openModal: boolean
	tableName: string | null
}>()

const emit = defineEmits(['close', 'update:show'])

const handleModalVisibility = (value: boolean) => {
	emit('update:show', value)
}

const localKey = ref('any')
const itemsPerPage = ref(useAuthStore().user.options.tableViewPageSize || 10)
const localTask = ref<BuilderTaskType>()
const showTab = ref('data')
const columns = ref<{ width?: number } & LocalFieldType[]>([])
const totalRows = ref(0)
const showTableInfo = ref(false)
const columnData = ref<LocalFieldType>()
const loading = ref(true)
const content = ref<HTMLElement>()

const useColumn = useColumnView()
const { t } = useI18n()

const itemsPerPageList = computed(() => {
	return Array.from({ length: 10 }, (_, i) => {
		const value = (i + 1) * 10
		return {
			label: value.toString() + ' ' + (showTab.value === 'data' ? t('rows').toLowerCase() : t('categories')),
			value,
		}
	})
})

const updateUserTablePreviewPreferences = () => {
	if (showTab.value === 'data') {
		useAuthStore().user.options.tableViewPageSize = itemsPerPage.value
	} else {
		useAuthStore().user.options.tableFrequencyPageSize = itemsPerPage.value
	}

	useAuthStore().updateUserOptions()
}

const changePageSizeAndRefresh = () => {
	updateUserTablePreviewPreferences()
	refreshData()
}

const refreshData = (clear = false) => {
	if (clear) {
		useTableStore().resetFilter(localTask.value)
		localTask.value.schema.filter = useTableStore().getFilter(localTask.value)
	}
	localKey.value = Math.random().toString()
}

const selectColumn = (col: FieldType) => {
	useColumn.defineColumnView(col, totalRows.value)
	showTableInfo.value = true
}

const countTableRows = async () => {
	const { totalRows: qtd } = await useApi().post(`api/table/count`, {
		body: {
			taskData: {
				...localTask.value,
			},
		},
	})

	totalRows.value = qtd
}

const listFieldNames = async () => {
	const { data } = await useApi().post(`api/table/field`, {
		body: {
			taskData: {
				...localTask.value,
			},
		},
	})

	columns.value = data

	if (!columns.value.length) {
		loading.value = false
	}
}

const clearTableInfo = () => {
	showTableInfo.value = false
	columnData.value = null
}

const initTableView = async () => {
	clearTableInfo()

	const schema = useAppStore().cloneTask().schema || defaultSchema

	localTask.value = useDefault({
		type: 'builder',
		base: {
			...useAppStore().appInfo,
			...(useAppStore().cloneTask() || {}),
			schema,
		},
	}) as BuilderTaskType

	if (tableName) {
		localTask.value.tableName = tableName
	}

	loading.value = true
	await countTableRows()
	await listFieldNames()
	localKey.value = Math.random().toString()
}

const tableReference = computed(() => useAppStore().task.tableName)

watch(
	() => tableReference.value,
	() => initTableView(),
	{ immediate: true },
)
</script>

<style scoped lang="scss">
.table-view {
	table {
		td,
		th {
			white-space: nowrap;
			padding-right: 0.8rem;
			padding-left: 0.8rem;
		}
	}
}
</style>
