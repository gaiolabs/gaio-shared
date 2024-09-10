<template>
	<div
		:key="localKey"
		class="report-chart m-0 overflow-hidden rounded border bg-paper-100 p-0 dark:bg-carbon-100"
	>
		<NSpin
			:show="loading"
			:style="{ minHeight: height }"
		>
			<ReportNodeHeader
				:task="task"
				:table-rows="tableRows"
			/>
			<template v-if="list?.length">
				<div class="px-2">
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
import { cloneDeep, debounce } from 'lodash-es'
import { computed, onMounted, ref, watch } from 'vue'
import ReportChartFunnel from './ReportChartFunnel.vue'

defineEmits(['change'])
const { task, height } = defineProps<{ task: ReportNodeType; height: string; cardHeight: string }>()

const loading = ref(true)
const localKey = ref('any')
const list = ref([])
const tableRows = ref(0)
const settings = computed(() => task.settings)
const firstLoad = ref(false)
console.log('task.reportType', task.reportType)
watch(
	() => settings.value,
	debounce(() => {
		if (firstLoad.value) {
			localKey.value = Math.random().toString(36).substring(7)
		} else {
			firstLoad.value = true
		}
	}, 600),
	{
		deep: true
	}
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
				params: useAppStore().params
			}
		})
		.then((res) => {
			list.value = res.data

			tableRows.value = res.rows_before_limit_at_least
			loading.value = false
		})
		.catch(() => (loading.value = false))
})
</script>
