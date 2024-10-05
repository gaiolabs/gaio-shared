<template>
	<div class="table-frequency">
		<div class="g-bg-1 mb-3 rounded p-2">
			<div class="table-data-header mb-3 mt-2 flex justify-between">
				<table-data-filter
					:columns="columns"
					:local-task="localTask"
					:total-rows="totalRows"
					:total-rows-filtered="totalRowsFiltered"
					class="flex-grow"
					@load-filter="applyFilter"
				/>
			</div>
		</div>
		<splitpanes>
			<pane :size="18">
				<div class="g-bg-1 mb-3 rounded p-1">
					<NInput
						v-model:value="searchTerm"
						:placeholder="$t('filter')"
						min="1"
						max="100"
						step="1"
					/>
				</div>
				<NTable
					size="small"
					class="g-bg-2"
				>
					<tbody>
						<tr
							v-for="col of $filterBy(columns, 'columnName', searchTerm)"
							:key="col.columnName"
						>
							<td
								class="!px-2"
								@click="selectColumn(col)"
							>
								<g-data-type-icon :data-type="col.dataType" />
								{{ col.columnName }}
							</td>
						</tr>
					</tbody>
				</NTable>
			</pane>
			<pane>
				<div class="g-bg-2 g-border-300 rounded">
					<column-frequency :key="refreshKey" />
				</div>
			</pane>
		</splitpanes>
	</div>
</template>
<script setup lang="ts">
import ColumnFrequency from '@/views/studio/tasks/column-view/ColumnFrequency.vue'
import { useColumnView } from '@/views/studio/tasks/column-view/useColumnView'
import TableDataFilter from '@/views/studio/tasks/table-view/TableDataFilter.vue'
import type { BuilderTaskType } from '@gaio/shared/types'
import type { FieldType } from '@gaio/shared/types'
import { getId } from '@gaio/shared/utils'
import { Pane, Splitpanes } from 'splitpanes'
import { onBeforeMount, ref } from 'vue'

const props = defineProps<{
	localTask: BuilderTaskType
	columns: FieldType[]
	totalRows: number
	loading: boolean
}>()

const searchTerm = ref('')
const totalRowsFiltered = ref(0)
const refreshKey = ref('any')
const applyFilter = () => (refreshKey.value = getId())

const selectColumn = (col: FieldType) => useColumnView().defineColumnView(col, props.totalRows)

onBeforeMount(() => {
	totalRowsFiltered.value = props.totalRows
	selectColumn(props.columns[0])
})
</script>
