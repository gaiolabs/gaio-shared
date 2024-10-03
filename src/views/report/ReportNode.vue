<template>
	<div
		v-if="task"
		class="report-card"
	>
		<template v-if="task.reportType === 'table'">
			<ReportTable
				:task="task"
				:height="height"
				:card-height="cardHeight"
				@trigger="$emit('trigger', $event)"
			/>
		</template>
		<template v-if="task.reportType === 'card'">
			<ReportCard />
		</template>
		<template v-if="task.reportType === 'download'">
			<ReportDownload :task="task" />
		</template>
		<template
			v-if="
				[
					'line',
					'bar',
					'area',
					'pie',
					'donut',
					'treemap',
					'funnel',
					'scatter',
					'bubble',
					'radar',
					'gauge',
					'sunburst',
					'calendar',
				].includes(task.reportType)
			"
		>
			<ReportChart
				:task="task"
				:height="height"
				:card-height="cardHeight"
			/>
		</template>
		<template v-if="task.reportType === 'form'">
			<ReportForm
				:task="task"
				:height="height"
			/>
		</template>
	</div>
</template>
<script setup lang="ts">
import ReportChart from '@/views/report/report-chart/ReportChart.vue'
import ReportForm from '@/views/report/report-form/ReportForm.vue'
import ReportTable from '@/views/report/report-table/ReportTable.vue'
import ReportCard from '@/views/report/ReportCard.vue'
import ReportDownload from '@/views/report/ReportDownload.vue'
import type { ReportNodeType } from '@gaio/shared/types/tasks/report.type'
import { computed } from 'vue'

defineEmits(['trigger'])
const props = defineProps<{ task: ReportNodeType }>()

watch(
	() => props.task,
	() => console.log('props.task', props.task),
)

const cardHeight = computed(() => {
	return (props.task?.height || 300) + 'px'
})

const height = computed(() => {
	if (props.task && props.task && props.task.settings) {
		if (props.task && props.task.settings && props.task.settings.showHeader && props.task.settings.title) {
			return (props.task.height || 300) - 100 + 'px'
		} else if ((props.task && props.task.settings && props.task.settings.showHeader) || props.task.settings.title) {
			return (props.task.height || 300) - 50 + 'px'
		}
		return (props.task.height || 300) - 20 + 'px'
	}
	return '90px'
})
</script>
