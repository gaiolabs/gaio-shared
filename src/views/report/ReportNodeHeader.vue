<template>
	<div
		v-if="task"
		id="ReportChartHeader"
		class="report-node-header p-1"
	>
		<div
			class="flex grow items-center"
			:class="headerBackground"
		>
			<div class="grow whitespace-pre-wrap py-2">
				<div :style="titleStyle">
					{{ renderString(task.settings.title) }}
				</div>
			</div>
			<template v-if="showRightActions">
				<div
					class="mx-1 py-2 text-right"
					:class="task.settings.title ? 'flex-grow-0' : 'flex-grow-1'"
				>
					<NPopover
						v-if="task.settings.description"
						:width="300"
						trigger="hover"
					>
						<div
							v-if="task.settings.description"
							class="control whitespace-pre-wrap p-2"
						>
							{{ renderString(task.settings.description) }}
						</div>
						<template #trigger>
							<NButton
								size="tiny"
								quaternary
							>
								<template #icon>
									<GIcon name="info" />
								</template>
							</NButton>
						</template>
					</NPopover>
					<NTooltip
						v-if="settings.showTable"
						:persistent="false"
						:show-after="1500"
					>
						<template #trigger>
							<NButton
								text
								@click="showTable = !showTable"
							>
								<GIcon name="table" />
							</NButton>
						</template>
						{{ $t('showTable') }}
					</NTooltip>
					<div v-if="!settings.showHeader && settings.showRows">#{{ tableRows }}</div>
					<report-download
						v-if="task.settings.downloadData && !task.settings.showHeader"
						:task="task"
					/>
				</div>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import GIcon from '@/components/GIcon.vue'
import ReportDownload from '@/views/report/ReportDownload.vue'
import type { ReportNodeType, ReportTaskSettingsType } from '@gaio/shared/types'
import { NButton, NPopover, NTooltip } from 'naive-ui'
import { computed, ref } from 'vue'

defineEmits(['close'])
const { tableRows = undefined, task = undefined } = defineProps<{
	task: ReportNodeType
	tableRows: number | undefined
}>()

const showRightActions = computed(() => {
	return (
		task.settings.description || settings.value.showTable || (!settings.value.showHeader && settings.value.showRows)
	)
})

const showTable = ref(false)

const renderString = (text: string) => {
	return text
}

const headerBackground = computed(() => {
	return task.settings.headerBackgroundDark ? 'bg-paper-200 dark:bg-carbon-200' : ''
})

const titleStyle = computed(() => {
	return {
		paddingLeft: '6px',
		paddingRight: '4px',
		textAlign: settings.value.titleAlign || 'left',
		fontSize: (Number(settings.value.titleFontSize) || 14) + 'px',
		color: settings.value.titleFontColor || 'inherit',
		fontWeight: settings.value.titleBold ? 'bold' : 'normal',
	}
})

const settings = computed<ReportTaskSettingsType>(() => {
	return task.settings
})
</script>
