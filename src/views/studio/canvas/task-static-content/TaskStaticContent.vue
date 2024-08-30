<script setup lang="ts">
import DrawerView from '@/components/drawer/DrawerView.vue'
import GIcon from '@/components/GIcon.vue'
import useDefaultReport from '@/composables/useDefaultReport'
import { useAppStore, useReportStore } from '@/stores'
import type { FieldType, ReportNodeType } from '@gaio/shared/types'
import type { StaticContentType } from '@gaio/shared/types/tasks/static-content.type'
import { getId } from '@gaio/shared/utils'
import { NButton, NScrollbar, NCard, NTabs, NTabPane } from 'naive-ui'
import { Pane, Splitpanes } from 'splitpanes'
import { onBeforeMount, ref } from 'vue'
import CodeEditor from './components/CodeEditor.vue'
import UpBarMenu from './components/UpBarMenu.vue'
import { STORAGE_NAMES, LANGUAGES, PAYLOAD } from './types/types'

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
		<DrawerView tag="task-builder" class="task-builder" @close="$emit('close')">
			<template #header>
				<UpBarMenu :show-tab="showTab" :local-task="localTask" @show-tab="showTab = $event" @close="$emit('close')" />
			</template>
			<template #content>
				<div v-if="true" class="task-builder-drops h-full w-full">
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
													<GIcon name="computed" />
												</template>
											</NButton>
											<NButton quaternary size="tiny" class="border-elevation-2 bg-paper-100 dark:bg-carbon-200">
												<template #icon>
													<GIcon name="globalComputed" />
												</template>
											</NButton>
										</div>
									</div>
								</NScrollbar>
							</div>
						</Pane>
						<Pane :size="84" class="w-full h-full">
							<Splitpanes class="h-full">
								<Pane :size="50" class="w-full h-full">
									<NTabs type="line" animated class="h-full bg-white">
										<NTabPane class="w-full h-full" name="html">
											<template #tab>
												<strong>HTML</strong>
											</template>
											<CodeEditor
												class="w-full h-full"
												:type="LANGUAGES.CSS"
												:display-name="LANGUAGES.CSS"
												@code-change="onChange"
											/>
										</NTabPane>
										<NTabPane name="script">
											<template #tab>
												<strong>Script</strong>
											</template>
											Hey Jude
										</NTabPane>
										<NTabPane name="style">
											<template #tab>
												<strong>Style</strong>
											</template>
											Qilixiang
										</NTabPane>
									</NTabs>
								</Pane>
								<Pane :size="50">
									<div class="m-2 h-full rounded bg-paper-100 dark:bg-carbon-200">
										<NScrollbar style="max-height: calc(100vh - 72px)">
											<div class="flex justify-between px-2 pb-1 pt-2 text-lg font-bold">
												{{ $t('options') }}
											</div>
										</NScrollbar>
									</div>
								</Pane>
							</Splitpanes>

							<Splitpanes class="h-full">
								<Pane></Pane>
							</Splitpanes>

							<Splitpanes class="h-full">
								<Pane></Pane>
							</Splitpanes>

							<Splitpanes>
								<Pane>
									<div class="my-2 h-full"></div>
								</Pane>
							</Splitpanes>
						</Pane>
					</Splitpanes>
				</div>
			</template>
		</DrawerView>
	</div>
</template>
