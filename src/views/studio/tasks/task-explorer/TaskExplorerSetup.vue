<template>
	<div class="task-report-setup h-full p-2">
		<div class="h-full rounded bg-paper-100 p-2 dark:bg-carbon-100">
			<NTabs
				v-model:value="useReportStore().currentSetupActiveTab"
				type="segment"
				animated
				size="small"
			>
				<NTabPane
					name="source"
					:tab="$t('source')"
				>
					<task-report-setup-fields />
				</NTabPane>
				<NTabPane
					name="reportType"
					:tab="$t('type')"
				>
					<task-report-setup-type />
				</NTabPane>
			</NTabs>
		</div>
	</div>
</template>
<script setup lang="ts">
import { useReportStore } from '@/stores'
import TaskReportSetupFields from '@/views/studio/tasks/task-explorer/TaskExplorerSetupFields.vue'
import TaskReportSetupType from '@/views/studio/tasks/task-explorer/TaskExplorerSetupType.vue'
import { NTabPane, NTabs } from 'naive-ui'
</script>
