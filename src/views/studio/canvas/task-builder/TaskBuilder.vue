<template>
	<div>
		<table-view
			v-if="showTab === 'table'"
			:table-name="viewTableData?.tableName"
			@close="showTab = 'builder'"
		/>
		<drawer-view
			v-else
			tag="task-builder"
			class="task-builder"
			@close="$emit('close')"
		>
			<template #header>
				<task-builder-menu
					:show-tab="showTab"
					:local-task="localTask"
					@show-tab="showTab = $event"
					@close="$emit('close')"
				/>
			</template>
			<template #content>
				<div
					v-if="localTask"
					class="task-builder-drops h-full w-full"
				>
					<Splitpanes class="h-full w-full">
						<pane :size="22">
							<div class="m-2 h-full rounded bg-paper-100 dark:bg-carbon-200">
								<n-scrollbar style="max-height: calc(100vh - 72px)">
									<div class="flex items-center justify-between p-3 pb-0 pt-2 font-bold">
										<div class="text-lg">
											{{ $t('columns') }}
										</div>
										<div class="flex items-center gap-1">
											<n-button
												size="tiny"
												quaternary
												class="border-elevation-2 bg-paper-100 dark:bg-carbon-200"
												@click="showTab = 'computed'"
											>
												<template #icon>
													<g-icon name="computed" />
												</template>
											</n-button>
											<n-button
												quaternary
												size="tiny"
												class="border-elevation-2 bg-paper-100 dark:bg-carbon-200"
											>
												<template #icon>
													<g-icon name="globalComputed" />
												</template>
											</n-button>
										</div>
									</div>
									<task-builder-fields
										class="px-3"
										:local-task="localTask"
										@view-table="viewTable"
										@edit-computed="editComputed"
									/>
								</n-scrollbar>
							</div>
						</pane>
						<pane :size="78">
							<!--BUILDER-->
							<splitpanes
								v-if="showTab === 'builder'"
								class="h-full"
							>
								<pane :size="78">
									<div class="my-2 h-full rounded bg-paper-200 dark:bg-carbon-100">
										<n-scrollbar style="max-height: calc(100vh - 72px)">
											<div class="mt-3 pb-[60px]">
												<task-builder-drop-select
													class="p-3 pt-0"
													:local-task="localTask"
													@choose="defineLocalField('select', $event)"
												/>
												<task-builder-drop-filter
													class="p-3"
													type="filter"
													:local-task="localTask"
													@choose="defineLocalField('filter', $event)"
												/>
												<task-builder-join
													class="p-3"
													:local-task="localTask"
												/>
												<task-builder-drop-group
													class="p-3"
													:local-task="localTask"
													@choose="defineLocalField('group', $event)"
												/>
												<task-builder-drop-sort
													class="p-3"
													:local-task="localTask"
													@choose="defineLocalField('sort', $event)"
												/>
												<task-builder-drop-filter
													class="p-3"
													type="having"
													:local-task="localTask"
													@choose="defineLocalField('having', $event)"
												/>
												<div class="flex w-full items-center gap-2 p-3">
													<div class="grow">
														<div class="mx-1 mb-1">{{ $t('rows') }}</div>
														<n-input-number
															v-model:value="localTask.schema.limit"
															:placeholder="$t('limit')"
															class="grow"
														/>
													</div>
													<div class="grow">
														<div class="mx-1 mb-1">{{ $t('pageOffset') }}</div>
														<n-input-number
															v-model:value="localTask.schema.offset"
															:placeholder="$t('offset')"
															class="grow"
														/>
													</div>
												</div>
												<task-builder-drop-limit-by
													v-if="localTask.client === 'clickhouse' && localTask.schema.limit > 0"
													class="p-3"
													:local-task="localTask"
													@choose="defineLocalField('limitBy', $event)"
												/>
											</div>
										</n-scrollbar>
									</div>
								</pane>
								<pane :size="22">
									<div class="m-2 h-full rounded bg-paper-100 dark:bg-carbon-200">
										<n-scrollbar style="max-height: calc(100vh - 72px)">
											<div class="flex justify-between px-2 pb-1 pt-2 text-lg font-bold">
												{{ $t('options') }}
											</div>
											<task-builder-options
												:local-task="localTask"
												:local-field="localField"
											/>
										</n-scrollbar>
									</div>
								</pane>
							</splitpanes>
							<!--SQL-->
							<splitpanes
								v-else-if="showTab === 'sql'"
								class="h-full"
							>
								<pane>
									<task-builder-sql :local-task="localTask" />
								</pane>
							</splitpanes>
							<!--PREVIEW-->
							<splitpanes
								v-else-if="showTab === 'preview'"
								class="h-full"
							>
								<pane>
									<task-builder-preview :local-task="localTask" />
								</pane>
							</splitpanes>
							<!--COMPUTED-->
							<splitpanes v-else-if="showTab === 'computed'">
								<pane>
									<div class="my-2 h-full">
										<task-builder-edit-computed
											:key="localField?.field?.computedId"
											:local-field="localField"
											:local-task="localTask"
											@close="showTab = 'builder'"
										/>
									</div>
								</pane>
							</splitpanes>
						</pane>
					</Splitpanes>
				</div>
			</template>
		</drawer-view>
	</div>
</template>
<script setup lang="ts">
import 'splitpanes/dist/splitpanes.css'

import useDefault from '@/composables/useDefault'
import { useAppStore } from '@/stores'
import TableView from '@/views/studio/canvas/table-view/TableView.vue'
import type { BuilderTaskType, FieldType } from '@gaio/shared/types'
import { Pane, Splitpanes } from 'splitpanes'
import { onBeforeMount, ref } from 'vue'
import TaskBuilderDropFilter from './task-builder-drop/TaskBuilderDropFilter.vue'
import TaskBuilderDropGroup from './task-builder-drop/TaskBuilderDropGroup.vue'
import TaskBuilderDropLimitBy from './task-builder-drop/TaskBuilderDropLimitBy.vue'
import TaskBuilderDropSelect from './task-builder-drop/TaskBuilderDropSelect.vue'
import TaskBuilderDropSort from './task-builder-drop/TaskBuilderDropSort.vue'
import TaskBuilderJoin from './task-builder-join/TaskBuilderJoin.vue'
import TaskBuilderOptions from './task-builder-options/TaskBuilderOptions.vue'
import TaskBuilderEditComputed from './TaskBuilderEditComputed.vue'
import TaskBuilderFields from './TaskBuilderFields.vue'
import TaskBuilderMenu from './TaskBuilderMenu.vue'
import TaskBuilderPreview from './TaskBuilderPreview.vue'
import TaskBuilderSql from './TaskBuilderSql.vue'

defineEmits(['close'])

const localTask = ref<BuilderTaskType>()

const localField = ref<{ type: string; field: Partial<FieldType> }>({
	type: '',
	field: {} as FieldType
})

const viewTableData = ref()
const showTab = ref('builder')

const editComputed = (field: FieldType) => {
	defineLocalField('computed', field)
	showTab.value = 'computed'
}

const defineLocalField = (type: string, field: FieldType) => {
	localField.value = {
		type,
		field
	}
}

const viewTable = (table) => {
	viewTableData.value = table
	showTab.value = 'table'
}

onBeforeMount(() => {
	localTask.value = useDefault({
		type: 'builder',
		base: useAppStore().cloneTask()
	})

	console.log(localTask.value)
})
</script>
