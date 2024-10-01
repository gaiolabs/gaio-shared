<template>
	<div class="task-report-preview">
		<div class="control flex items-center justify-between gap-2 rounded bg-paper-200 p-1 px-2 dark:bg-carbon-200">
			<div class="flex grow items-center gap-1">
				<g-icon :name="currentReportType.icon" />
				{{ currentReportType.label }}
			</div>
			<div class="flex items-center justify-end gap-2">
				<NButton
					size="small"
					quaternary
					:type="!showHelp ? 'primary' : 'error'"
					@click="showHelp = !showHelp"
				>
					<span v-if="!showHelp">
						{{ $t('help') }}
					</span>
					<span v-else>
						{{ $t('close') }}
					</span>
				</NButton>
			</div>
			<NInputNumber
				v-model:value="height"
				:min="60"
				class="w-[140px]"
			>
				<template #prefix>{{ $t('height') }}</template>
			</NInputNumber>
		</div>
		<ReportNode
			v-if="reportState.status && !showHelp"
			:key="useReportStore().refreshPreviewKey"
			:task="task"
		/>
		<div v-else>
			<div v-if="reportState?.rules?.length">
				<NTable
					bordered
					striped
				>
					<thead>
						<tr>
							<th>{{ $t('name') }}</th>
							<th>{{ $t('dimension') }}</th>
							<th>{{ $t('measure') }}</th>
							<th>{{ $t('description') }}</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(item, index) of reportState.rules"
							:key="index"
						>
							<td>{{ $t(item.name) }}</td>
							<td>
								<NTag type="success">
									{{ $t(item.dimensions) }}
								</NTag>
							</td>
							<td>
								<NTag type="success">{{ $t(item.measures) }}</NTag>
							</td>
							<td>{{ $t(item.message) }}</td>
						</tr>
					</tbody>
				</NTable>
			</div>
			<div v-else>Card Not Done</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { useReportStore } from '@/stores/useReportStore'
import ReportNode from '@/views/report/ReportNode.vue'
import { taskExplorerTypeList } from '@/views/studio/canvas/task-explorer/TaskExplorerTypeList'
import { NButton, NInputNumber, NTable } from 'naive-ui'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const task = computed(() => {
	return {
		...useReportStore().current,
		height: height.value,
	}
})

const showHelp = ref(false)
const height = ref(400)

const currentReportType = computed(() => {
	return taskExplorerTypeList(t)
		.map((item) => item.children)
		.flatMap((item) => {
			return item
		})
		.find((item) => {
			if (useReportStore().current.reportType === 'bar' && item.reportType === 'bar') {
				return useReportStore().current.settings.columnBar === item.settings.columnBar
			} else {
				return item.reportType === useReportStore().current.reportType
			}
		})
})

const verifyRules = (dimensions: number | string, measures: number | string) => {
	const mea = task.value.schema.select.filter((o) => o.type !== 'value' && !o.hidden).length
	const dim = task.value.schema.select.filter((o) => o.type === 'value').length

	if (dimensions === 'n' && measures === 'n' && (mea >= 1 || dim >= 1)) {
		return true
	} else if (
		typeof mea === 'number' &&
		typeof measures === 'number' &&
		mea >= measures &&
		typeof dim === 'number' &&
		typeof dimensions === 'number' &&
		dim >= dimensions
	) {
		return true
	}
	return false
}

const reportState = computed(() => {
	const reportType = task.value.reportType
	if (['table', 'card', 'download'].includes(reportType)) {
		return {
			status: verifyRules('n', 'n'),
			rules: [
				{
					name: 'general',
					dimensions: 'multipleFields',
					measures: 'multipleFields',
					message: 'tableOfContent',
				},
			],
		}
	} else if (['column', 'line', 'bar', 'area'].includes(reportType)) {
		return {
			status: verifyRules(1, 1),
			rules: [
				{
					name: 'simple',
					dimensions: 'oneFieldOnly',
					measures: 'oneFieldOnly',
					message: 'oneMeasureIsFormed',
				},
				{
					name: 'groupedByMeasure',
					dimensions: 'oneFieldOnly',
					measures: 'multipleFields',
					message: 'measuresAreFoldedIntoCategory',
				},
				{
					name: 'grouped',
					dimensions: 'twoFieldOnly',
					measures: 'oneFieldOnly',
					message: 'measureIsGroupedByTheSecondDimension',
				},
			],
		}
	} else if (['pie', 'funnel', 'donut'].includes(reportType)) {
		return {
			status: verifyRules(1, 1),
			rules: [
				{
					name: 'simple',
					dimensions: 'oneFieldOnly',
					measures: 'oneFieldOnly',
					message: 'oneMeasureIsFormed',
				},
			],
		}
	} else if (['treemap'].includes(reportType)) {
		return {
			status: verifyRules(1, 1),
			rules: [
				{
					name: 'simple',
					dimensions: 'oneFieldOnly',
					measures: 'oneFieldOnly',
					message: 'oneMeasureIsFormed',
				},
			],
		}
	} else if (['scatter'].includes(reportType)) {
		return {
			status: verifyRules(1, 2),
			rules: [
				{
					name: 'scatter',
					dimensions: 'oneFieldOnly',
					measures: 'twoFieldOnly',
					message: 'oneMeasureIsFormed',
				},
			],
		}
	} else if (['bubble'].includes(reportType)) {
		return {
			status: verifyRules(2, 3),
			rules: [
				{
					name: 'bubble',
					dimensions: 'twoFieldOnly',
					measures: 'threeFieldOnly',
					message: 'oneMeasureIsFormed',
				},
			],
		}
	} else if (['radar'].includes(reportType)) {
		return {
			status: verifyRules('n', 'n'),
			rules: [
				{
					name: 'radar',
					dimensions: 'oneFieldOnly',
					measures: 'multipleFields',
					message: 'measuresAreFoldedIntoCategory',
				},
				{
					name: 'radar',
					dimensions: 'twoFieldOnly',
					measures: 'multipleFields',
					message: 'measuresAreFoldedIntoCategory',
				},
			],
		}
	} else if (['gauge'].includes(reportType)) {
		return {
			status: verifyRules(1, 3),
			rules: [
				{
					name: 'gauge',
					dimensions: 'oneFieldOnly',
					measures: 'threeFields',
					message: 'threeMeasuresMinMaxTarget',
				},
			],
		}
	}
	return {}
})
</script>
