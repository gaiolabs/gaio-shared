<script setup lang="ts">
import DrawerView from '@/components/drawer/DrawerView.vue'
import useDefaultReport from '@/composables/useDefaultReport'
import { useAppStore, useReportStore } from '@/stores'
import type { FieldType, ReportNodeType } from '@gaio/shared/types'
import type { StaticContentType } from '@gaio/shared/types/tasks/static-content.type'
import { getId } from '@gaio/shared/utils'
import { NButton, NCard, NModal, NScrollbar } from 'naive-ui'
import { Pane, Splitpanes } from 'splitpanes'
import { onBeforeMount, ref } from 'vue'
import TaskStaticContentMenu from './TaskStaticContentMenu.vue'

defineEmits(['close'])

const localTask = ref<StaticContentType>()

const localField = ref<{ type: string; field: Partial<FieldType> }>({
	type: '',
	field: {} as FieldType
})

const viewTableData = ref()
const showTab = ref('staticContainer')

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
	useReportStore().resetReport()
	useReportStore().current = useDefaultReport({
		type: 'report',
		reportType: useAppStore().cloneTask()?.reportType || 'staticContent',
		base: {
			...useAppStore().appInfo,
			...useAppStore().cloneTask(),
			id: useAppStore().cloneTask().type !== 'report' ? getId() : useAppStore().cloneTask()?.id
		} as ReportNodeType
	})

	console.log('useReportStore().current', useReportStore().current)
})
</script>

<template>
	<div>
		<DrawerView
			tag="task-builder"
			class="task-builder"
			@close="$emit('close')"
		>
			<template #header>
				<task-static-content-menu
					:show-tab="showTab"
					:local-task="localTask"
					@show-tab="showTab = $event"
					@close="$emit('close')"
				/>
			</template>
			<template #content>
				<div
					v-if="true"
					class="task-builder-drops h-full w-full"
				>
					<Splitpanes class="h-full w-full">
						<Pane :size="16">
							<div class="m-2 h-full rounded bg-paper-100 dark:bg-carbon-200">
								<NScrollbar style="max-height: calc(100vh - 72px)">
									<div class="flex items-center justify-between p-3 pb-0 pt-2 font-bold">
										<div class="text-lg">
											{{ $t('general') }}
										</div>
										<div class="flex items-center gap-1">
											<NButton
												size="tiny"
												quaternary
												class="border-elevation-2 bg-paper-100 dark:bg-carbon-200"
												@click="showTab = 'computed'"
											>
												<template #icon>
													<g-icon name="computed" />
												</template>
											</NButton>
											<NButton
												quaternary
												size="tiny"
												class="border-elevation-2 bg-paper-100 dark:bg-carbon-200"
											>
												<template #icon>
													<g-icon name="globalComputed" />
												</template>
											</NButton>
										</div>
									</div>
								</NScrollbar>
							</div>
						</Pane>
						<Pane :size="84">
							<Splitpanes class="h-full">
								<Pane :size="50">
									<div class="my-2 h-full rounded bg-paper-200 dark:bg-carbon-100">
										<NScrollbar style="max-height: calc(100vh - 72px)">
											<div class="mt-3 pb-[60px]"></div>
										</NScrollbar>
									</div>
								</Pane>
								<Pane :size="50">
									<div class="m-2 h-full rounded bg-paper-100 dark:bg-carbon-200">
										<NScrollbar style="max-height: calc(100vh - 72px)">
											<div class="flex justify-between px-2 pb-1 pt-2 text-lg font-bold">
												{{ $t('options') }}
											</div>
											<!-- <task-builder-options :local-task="localTask" :local-field="localField" /> -->
										</NScrollbar>
									</div>
								</Pane>
							</Splitpanes>
							<!--SQL-->
							<Splitpanes class="h-full">
								<Pane>
									<task-builder-sql :local-task="localTask" />
								</Pane>
							</Splitpanes>
							<!--PREVIEW-->
							<Splitpanes class="h-full">
								<Pane>
									<task-builder-preview :local-task="localTask" />
								</Pane>
							</Splitpanes>
							<!--COMPUTED-->
							<Splitpanes>
								<Pane>
									<div class="my-2 h-full">
										<!-- <task-builder-edit-computed :key="localField?.field?.computedId"
                                            :local-field="localField" :local-task="localTask"
                                            @close="showTab = 'builder'" /> -->
									</div>
								</Pane>
							</Splitpanes>
						</Pane>
					</Splitpanes>
				</div>
			</template>
		</DrawerView>
	</div>
</template>
