<template>
	<div class="task-report-setup-type size-full">
		<div
			v-for="list of reportList"
			:key="list.type"
			class="mt-2 w-full"
		>
			{{ list.label }}
			<div class="grid w-full grid-cols-3 gap-2">
				<div
					v-for="report of list.children"
					:key="report.type"
				>
					<div
						class="mb-1 flex h-[50px] cursor-pointer items-center justify-center rounded bg-paper-200 dark:bg-carbon-200"
						@click="select(report)"
					>
						<div>
							<g-icon
								v-if="report?.icon"
								class="h-8 w-8"
								:height="26"
								:name="report.icon"
							/>
							<img
								v-else
								:src="generateIcon(report)"
								:alt="report.label"
								class="h-8 w-8"
							/>
						</div>
					</div>
					<div class="item-center flex w-full justify-center">
						<small>{{ report.label }}</small>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import useDefaultReport from '@/composables/useDefaultReport'
import { useAppStore, useReportStore } from '@/stores'
import { generateBase } from '@/views/studio/board/BoardIcons'
import { taskExplorerTypeList } from '@/views/studio/tasks/task-explorer/TaskExplorerTypeList'
import type { ReportNodeType } from '@gaio/shared/types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const select = (item) => {
	useReportStore().current.reportType = item.reportType

	useReportStore().current = useDefaultReport({
		type: useAppStore().cloneTask().type,
		reportType: item.reportType,
		base: useReportStore().current as ReportNodeType
	})

	if (item.settings) {
		useReportStore().current.settings = {
			...useReportStore().current.settings,
			...item.settings
		}
	}
}

const generateIcon = (item) => {
	const image = `../../../../assets${
		generateBase({
			...item,
			client: 'clickhouse',
			sourceType: 'bucket'
		}).image
	}`
	return new URL(image, import.meta.url).href
}
const reportList = taskExplorerTypeList(t)
</script>
