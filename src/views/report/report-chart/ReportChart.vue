<template>
	<div
		:key="localKey"
		class="report-chart m-0 overflow-hidden rounded border bg-paper-100 p-0 dark:bg-carbon-100"
	>
		<NSpin
			:show="loading"
			:style="{
				minHeight: `${Number(height.replace('px', '')) + 10}px`,
			}"
		>
			<ReportNodeHeader
				v-if="(settings.showTable || settings.description || settings.title) && !loading"
				:task="task"
				:table-rows="tableRows"
			/>
			<template v-if="list?.length">
				<div class="p-2">
					<ReportChartBarBk
						v-if="['bar'].includes(task.reportType) && !settings.columnBar"
						:task="task"
						:list="list"
						:height="height"
						@change="$emit('change', $event)"
					/>
					<ReportChartColumn
						v-if="['bar'].includes(task.reportType) && settings.columnBar"
						:task="task"
						:list="list"
						:height="height"
						@change="$emit('change', $event)"
					/>
					<ReportChartLine
						v-else-if="task.reportType === 'line'"
						:task="task"
						:list="list"
						:height="height"
						@change="$emit('change', $event)"
					/>
					<ReportChartArea
						v-else-if="task.reportType === 'area'"
						:task="task"
						:list="list"
						:height="height"
						@change="$emit('change', $event)"
					/>
					<ReportChartPie
						v-else-if="task.reportType === 'pie'"
						:task="task"
						:list="list"
						:height="height"
						@change="$emit('change', $event)"
					/>
					<ReportChartDonut
						v-else-if="task.reportType === 'donut'"
						:task="task"
						:list="list"
						:height="height"
						@change="$emit('change', $event)"
					/>
					<ReportChartTreemap
						v-else-if="task.reportType === 'treemap'"
						:task="task"
						:list="list"
						:height="height"
						@change="$emit('change', $event)"
					/>
					<ReportChartFunnel
						v-else-if="task.reportType === 'funnel'"
						:task="task"
						:list="list"
						:height="height"
						@change="$emit('change', $event)"
					/>
					<ReportChartScatter
						v-else-if="task.reportType === 'scatter'"
						:task="task"
						:list="list"
						:height="height"
						@change="$emit('change', $event)"
					/>
					<ReportChartBubble
						v-else-if="task.reportType === 'bubble'"
						:task="task"
						:list="list"
						:height="height"
						@change="$emit('change', $event)"
					/>
					<ReportChartRadar
						v-else-if="task.reportType === 'radar'"
						:task="task"
						:list="list"
						:height="height"
						@change="$emit('change', $event)"
					/>
				</div>
			</template>
		</NSpin>
	</div>
</template>

<script setup lang="ts">
import useApi from '@/composables/useApi'
import { useAppStore } from '@/stores'
import ReportChartArea from '@/views/report/report-chart/ReportChartArea.vue'
import ReportChartBarBk from '@/views/report/report-chart/ReportChartBarBk.vue'
import ReportChartColumn from '@/views/report/report-chart/ReportChartColumn.vue'
import ReportChartLine from '@/views/report/report-chart/ReportChartLine.vue'
import ReportChartPie from '@/views/report/report-chart/ReportChartPie.vue'
import ReportChartTreemap from '@/views/report/report-chart/ReportChartTreemap.vue'
import ReportNodeHeader from '@/views/report/ReportNodeHeader.vue'
import type { ReportNodeType } from '@gaio/shared/types'
import { cloneDeep } from 'lodash-es'
import { NSpin } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import ReportChartBubble from './ReportChartBubble.vue'
import ReportChartDonut from './ReportChartDonut.vue'
import ReportChartFunnel from './ReportChartFunnel.vue'
import ReportChartRadar from './ReportChartRadar.vue'
import ReportChartScatter from './ReportChartScatter.vue'

defineEmits(['change'])
const { task, height } = defineProps<{ task: ReportNodeType; height: string; cardHeight: string }>()

const loading = ref(true)
const localKey = ref('any')
const list = ref([])
const tableRows = ref(0)
const settings = computed(() => task.settings)

watch(
	() => task,
	() => {
		console.log('task', task)
		console.log('task.reporttype', task.reportType)
	},
)

onMounted(() => {
	loading.value = true

	const taskData = cloneDeep(task)

	if (taskData.settings.type === 'crosstab') {
		taskData.schema.limit = 5000
	} else {
		taskData.schema.limit = taskData.settings && taskData.settings.limitRows ? taskData.settings.limitRows : 10
	}

	useApi()
		.post('api/table/report', {
			body: {
				taskData,
				params: useAppStore().params,
			},
		})
		.then((res) => {
			list.value = res.data
			tableRows.value = res.rows_before_limit_at_least
			loading.value = false
		})
		.catch(() => (loading.value = false))
})
</script>
