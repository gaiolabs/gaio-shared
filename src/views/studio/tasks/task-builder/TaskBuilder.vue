<template>
	<div>
		<TableView
			v-if="showTab === 'table'"
			:table-name="viewTableData?.tableName"
			@close="showTab = 'builder'"
		/>
		<DrawerView
			v-else
			tag="task-builder"
			class="task-builder"
			@close="$emit('close')"
		>
			<template #header>
				<TaskBuilderMenu
					:show-tab="showTab"
					:local-task="localTask"
					@show-tab="showTab = $event"
					@close="$emit('close')"
				/>
			</template>
			<template #content>
				<GCard
					:type="isDark ? 'base' : 'wrapper'"
					class="h-full p-2"
				>
					<div
						v-if="localTask"
						class="task-builder-drops h-full w-full"
					>
						<Splitpanes class="h-full w-full">
							<Pane :size="22">
								<GTabs>
									<GTab
										name="columns"
										:label="$t('columns')"
										display-directive="show:lazy"
									>
										<NScrollbar class="h-full">
											<div class="flex items-end justify-end p-3 pb-0 pt-2 font-bold">
												<div class="flex items-center gap-1">
													<NButton
														size="tiny"
														quaternary
														class="border-elevation-2 bg-paper-100 dark:bg-carbon-200"
														@click="showTab = 'computed'"
													>
														<template #icon>
															<GIcon name="computed" />
														</template>
													</NButton>
													<NButton
														quaternary
														size="tiny"
														class="border-elevation-2 bg-paper-100 dark:bg-carbon-200"
													>
														<template #icon>
															<GIcon name="globalComputed" />
														</template>
													</NButton>
												</div>
											</div>
											<TaskBuilderFields
												class="px-3"
												:local-task="localTask"
												@view-table="viewTable"
												@edit-computed="editComputed"
											/>
										</NScrollbar>
									</GTab>
								</GTabs>
							</Pane>
							<!--COMPUTED-->
							<Pane
								v-if="showTab === 'computed'"
								:size="78"
							>
								<TaskBuilderEditComputed
									:key="localField?.field?.computedId"
									:local-field="localField"
									:local-task="localTask"
									class="my-2 h-full w-full"
									@close="showTab = 'builder'"
								/>
							</Pane>

							<Pane
								v-else
								:size="78"
							>
								<!--BUILDER-->
								<GTabs>
									<GTab
										name="builder"
										:label="$t('builder')"
										display-directive="show:lazy"
									>
										<Splitpanes class="h-full">
											<Pane :size="78">
												<div class="my-2 h-full rounded bg-paper-200 dark:bg-carbon-100">
													<NScrollbar style="max-height: calc(100vh - 72px)">
														<div class="mt-3 pb-[60px]">
															<TaskBuilderDropSelect
																class="p-3 pt-0"
																:local-task="localTask"
																@choose="defineLocalField('select', $event)"
															/>
															<TaskBuilderDropFilter
																class="p-3"
																type="filter"
																:local-task="localTask"
																@choose="defineLocalField('filter', $event)"
															/>
															<TaskBuilderJoin
																class="p-3"
																:local-task="localTask"
															/>
															<TaskBuilderDropGroup
																class="p-3"
																:local-task="localTask"
																@choose="defineLocalField('group', $event)"
															/>
															<TaskBuilderDropSort
																class="p-3"
																:local-task="localTask"
																@choose="defineLocalField('sort', $event)"
															/>
															<TaskBuilderDropFilter
																class="p-3"
																type="having"
																:local-task="localTask"
																@choose="defineLocalField('having', $event)"
															/>
															<div class="flex w-full items-center gap-2 p-3">
																<div class="grow">
																	<div class="mx-1 mb-1">{{ $t('rows') }}</div>
																	<NInputNumber
																		v-model:value="localTask.schema.limit"
																		:placeholder="$t('limit')"
																		class="grow"
																	/>
																</div>
																<div class="grow">
																	<div class="mx-1 mb-1">{{ $t('pageOffset') }}</div>
																	<NInputNumber
																		v-model:value="localTask.schema.offset"
																		:placeholder="$t('offset')"
																		class="grow"
																	/>
																</div>
															</div>
															<TaskBuilderDropLimitBy
																v-if="localTask.client === 'clickhouse' && localTask.schema.limit > 0"
																class="p-3"
																:local-task="localTask"
																@choose="defineLocalField('limitBy', $event)"
															/>
														</div>
													</NScrollbar>
												</div>
											</Pane>

											<Pane :size="22">
												<div class="m-2 h-full rounded bg-paper-100 dark:bg-carbon-200">
													<NScrollbar style="max-height: calc(100vh - 72px)">
														<div class="flex justify-between px-2 pb-1 pt-2 text-lg font-bold">
															{{ $t('options') }}
														</div>
														<TaskBuilderOptions
															:local-task="localTask"
															:local-field="localField"
														/>
													</NScrollbar>
												</div>
											</Pane>
										</Splitpanes>
									</GTab>
									<GTab
										name="sql"
										:label="$t('sql')"
										display-directive="show:lazy"
									>
										<TaskBuilderSql :local-task="localTask" />
									</GTab>
									<GTab
										name="preview"
										:label="$t('preview')"
										display-directive="show:lazy"
									>
										<TaskBuilderPreview :local-task="localTask" />
									</GTab>
									<!-- 
								<GTab
									name="computed"
									:label="$t('computed')"
									display-directive="show:lazy"
								> -->

									<!-- </GTab> -->
								</GTabs>
							</Pane>
						</Splitpanes>
					</div>
				</GCard>
			</template>
		</DrawerView>
	</div>
</template>

<script setup lang="ts">
import 'splitpanes/dist/splitpanes.css'
import DrawerView from '@/components/drawer/DrawerView.vue'
import GCard from '@/components/GCard.vue'
import GIcon from '@/components/GIcon.vue'
import GTab from '@/components/inputs/GTab.vue'
import GTabs from '@/components/inputs/GTabs.vue'
import useDefault from '@/composables/useDefault'
import { useAppStore } from '@/stores'
import TableView from '@/views/studio/tasks/table-view/TableView.vue'
import type { BuilderTaskType, FieldType } from '@gaio/shared/types'
import { useDark } from '@vueuse/core'
import { NButton, NInputNumber, NScrollbar } from 'naive-ui'
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
	field: {} as FieldType,
})

const viewTableData = ref()
const showTab = ref('builder')

const isDark = useDark()

const editComputed = (field: FieldType) => {
	defineLocalField('computed', field)
	showTab.value = 'computed'
}

const defineLocalField = (type: string, field: FieldType) => {
	localField.value = {
		type,
		field,
	}
}

const viewTable = (table) => {
	viewTableData.value = table
	showTab.value = 'table'
}

onBeforeMount(() => {
	localTask.value = useDefault({
		type: 'builder',
		base: useAppStore().cloneTask(),
	})

	console.log(localTask.value)
})
</script>
