<template>
	<div class="task-report-options h-full p-2">
		<div class="h-full rounded bg-paper-100 p-2 dark:bg-carbon-100">
			<div v-if="useReportStore().currentField">
				<options-field />
			</div>
			<div v-else>
				<OptionsTable v-if="task.reportType === 'table'" />
				<OptionsChart v-if="task.reportType !== 'table'" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useReportStore } from '@/stores'
import OptionsChart from '@/views/studio/tasks/task-explorer/task-explorer-options/options-chart/OptionsChart.vue'
import OptionsField from '@/views/studio/tasks/task-explorer/task-explorer-options/options-field/OptionsField.vue'
import OptionsTable from '@/views/studio/tasks/task-explorer/task-explorer-options/options-table/OptionsTable.vue'
import { computed } from 'vue'

const task = computed(() => useReportStore().current)
</script>

<style lang="scss">
.task-report-options {
	.n-collapse .n-collapse-item .n-collapse-item .n-collapse-item__header-main {
		display: flex;
		justify-content: flex-start;
	}

	.n-collapse-item__header-main {
		display: flex;
		justify-content: space-between;
	}
}
</style>
