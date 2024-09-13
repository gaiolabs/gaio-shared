<template>
	<div
		v-if="useReportStore().current"
		class="task-report-view h-full"
	>
		<drawer-view
			tag="task-report-view"
			class="task-report-view"
			@close="$emit('close')"
		>
			<template #header>
				<div class="flex w-full justify-between">
					<div class="flex items-center gap-2">
						<task-icon
							:local-task="useReportStore().current"
							class="ms-2 size-[18px]"
						/>
						<NInput v-model:value="useReportStore().current.label" />
					</div>
					<div class="flex items-center gap-2">
						<NButton
							size="small"
							@click="refresh()"
						>
							<template #icon>
								<g-icon name="refresh" />
							</template>
							{{ $t('refresh') }}
						</NButton>
						<NButton
							size="small"
							type="primary"
							@click="save()"
						>
							{{ $t('save') }}
						</NButton>
						<NDivider vertical />
					</div>
				</div>
			</template>
			<template #content>
				<div class="flex h-full">
					<splitpanes>
						<pane :size="22">
							<task-report-setup class="w-full" />
						</pane>
						<pane>
							<div class="mt-2 w-full grow rounded">
								<task-report-schema />
								<task-report-preview />
							</div>
						</pane>
						<pane :size="22">
							<task-report-options class="w-full" />
						</pane>
					</splitpanes>
				</div>
			</template>
		</drawer-view>
	</div>
</template>
<script setup lang="ts">
import 'splitpanes/dist/splitpanes.css'

import useDefault from '@/composables/useDefault'
import useDefaultReport from '@/composables/useDefaultReport'
import useFlow from '@/composables/useFlow'
import { useAppStore, useReportStore } from '@/stores'
import TaskReportOptions from '@/views/studio/canvas/task-explorer/TaskExplorerOptions.vue'
import TaskReportPreview from '@/views/studio/canvas/task-explorer/TaskExplorerPreview.vue'
import TaskReportSchema from '@/views/studio/canvas/task-explorer/TaskExplorerSchema.vue'
import TaskReportSetup from '@/views/studio/canvas/task-explorer/TaskExplorerSetup.vue'
import type { ReportNodeType } from '@gaio/shared/types'
import { getId } from '@gaio/shared/utils'
import { NButton, NDivider } from 'naive-ui'
import { Pane, Splitpanes } from 'splitpanes'
import { onMounted } from 'vue'

const emit = defineEmits(['close'])

const refresh = () => {
	useReportStore().refreshPreview()
}

const save = () => {
	useReportStore().current.id = useReportStore().current.id || getId()

	useReportStore().current.schema.select.forEach((el) => {
		if (el.columnName === 'state') {
			el.fontColor = '#e32'
		}
	})

	useFlow(useAppStore().flow.workflow)
		.generate({
			task: useReportStore().current,
			sources: [
				useDefault({
					type: 'table',
					base: {
						...useReportStore().current,
						label: useReportStore().current.tableName,
						tableName: useReportStore().current.tableName
					}
				})
			],
			targets: [
				useDefault({
					type: 'reportPreview',
					base: {
						...useReportStore().current,
						reportId: useReportStore().current.id
					}
				})
			]
		})
		.save()
		.then(() => emit('close'))
}

onMounted(() => {
	useReportStore().resetReport()
	useReportStore().current = useDefaultReport({
		type: 'report',
		reportType: useAppStore().cloneTask()?.reportType || 'table',
		base: {
			...useAppStore().appInfo,
			...useAppStore().cloneTask(),
			id: useAppStore().cloneTask().type !== 'report' ? getId() : useAppStore().cloneTask()?.id
		} as ReportNodeType
	})
})
</script>
