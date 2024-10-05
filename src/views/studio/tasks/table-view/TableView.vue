<template>
	<drawer-view
		tag="table-view"
		data-tag="table-view"
		@close="$emit('close')"
	>
		<template #header>
			<div class="flex w-full items-center justify-between gap-3">
				<div class="flex flex-grow items-center gap-3">
					<div class="flex items-center gap-2 font-semibold">
						<g-icon name="table" />
						{{ localTask?.label }}
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
		<template #content>
			<div
				v-if="columns?.length"
				ref="content"
				class="table-view table-view-content w-100 h-full px-3 py-2"
			>
				<div v-if="showTab === 'data'">
					<table-data
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
					<table-columns
						:columns="columns"
						:local-task="localTask"
						:loading="loading"
						@load="loading = $event"
						@select-column="selectColumn"
					/>
				</div>
				<div v-if="showTab === 'stats'">
					<table-stats
						:columns="columns"
						:local-task="localTask"
						:total-rows="totalRows"
						:loading="loading"
						@load="loading = $event"
					/>
				</div>
				<div v-if="showTab === 'frequency'">
					<table-frequency
						:local-task="localTask"
						:columns="columns"
						:total-rows="totalRows"
						:loading="loading"
					/>
				</div>
			</div>
			<g-alert
				v-else-if="!loading"
				:title="$t('missingTable')"
			/>
			<template v-if="showTableInfo">
				<column-view @close="showTableInfo = false" />
			</template>
		</template>
	</drawer-view>
</template>

<script setup lang="ts">
import DrawerView from '@/components/drawer/DrawerView.vue'
import { defaultSchema } from '@/composables/default-task/defaultSchema'
import useApi from '@/composables/useApi'
import useDefault from '@/composables/useDefault'
import { useAppStore, useAuthStore, useTableStore } from '@/stores'
import ColumnView from '@/views/studio/canvas/column-view/ColumnView.vue'
import { useColumnView } from '@/views/studio/tasks/column-view/useColumnView'
import TableColumns from '@/views/studio/canvas/table-view/TableColumns.vue'
import TableData from '@/views/studio/canvas/table-view/TableData.vue'
import TableFrequency from '@/views/studio/canvas/table-view/TableFrequency.vue'
import TableStats from '@/views/studio/canvas/table-view/TableStats.vue'
import type { BuilderTaskType, FieldType } from '@gaio/shared/types'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

type LocalFieldType = { width?: number } & FieldType

defineEmits(['close'])

const props = defineProps({
	tableName: {
		type: String,
		required: false,
		default: null,
	},
})

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

	if (props.tableName) {
		localTask.value.tableName = props.tableName
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

<style lang="scss">
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
