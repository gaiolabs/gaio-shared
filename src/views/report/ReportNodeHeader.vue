<template>
	<div
		v-if="task"
		class="report-node-header p-1"
	>
		<div
			v-if="settings.showHeader"
			class="flex items-center border-b px-2 py-2"
			:class="headerBackground"
		>
			<div class="grow text-lg">
				{{ task.label }}
			</div>
			<div class="flex items-center">
				<n-popover
					v-if="task.settings.description"
					:width="300"
					trigger="hover"
				>
					<div
						v-if="task.settings.description"
						class="control whitespace-pre-wrap p-2"
						v-html="renderString(task.settings.description)"
					/>
					<template #trigger>
						<NButton
							size="tiny"
							quaternary
						>
							<template #icon>
								<g-icon name="info" />
							</template>
						</NButton>
					</template>
				</n-popover>
				<div v-if="showCloseTable">
					<NDivider vertical />
					<g-icon
						name="close"
						@click="$emit('close')"
					/>
				</div>
				<div v-if="settings.showRows">
					<NDivider vertical />
					#{{ tableRows }}
				</div>
			</div>
		</div>
		<div
			v-if="task.settings.title"
			class="flex grow items-center"
		>
			<div class="grow whitespace-pre-wrap py-2">
				<div
					:style="titleStyle"
					v-html="renderString(task.settings.title)"
				/>
			</div>
			<template v-if="!task.settings.showHeader && showRightActions">
				<div
					class="mx-1 py-2 text-right"
					:class="task.settings.title ? 'flex-grow-0' : 'flex-grow-1'"
				>
					<n-popover
						v-if="task.settings.description"
						:width="300"
						trigger="hover"
					>
						<div
							v-if="task.settings.description"
							class="control whitespace-pre-wrap p-2"
							v-html="renderString(task.settings.description)"
						/>
						<template #trigger>
							<NButton
								size="tiny"
								quaternary
							>
								<template #icon>
									<g-icon name="info" />
								</template>
							</NButton>
						</template>
					</n-popover>
					<n-tooltip
						v-if="settings.showTable"
						:persistent="false"
						:show-after="1500"
					>
						<template #trigger>
							<NButton
								text
								@click="showTable = !showTable"
							>
								<g-icon name="table" />
							</NButton>
						</template>
						{{ $t('showTable') }}
					</n-tooltip>
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
import ReportDownload from '@/views/report/ReportDownload.vue'
import type { ReportNodeType, ReportTaskSettingsType } from '@gaio/shared/types'
import { computed, ref } from 'vue'

defineEmits(['close'])
const props = withDefaults(defineProps<{ task: ReportNodeType; tableRows: number | undefined }>(), {
	tableRows: undefined,
	task: undefined
})

const showRightActions = computed(() => {
	return (
		props.task.settings.description ||
		settings.value.showTable ||
		(!settings.value.showHeader && settings.value.showRows)
	)
})

const showTable = ref(false)

const renderString = (text: string) => {
	return text
}

const showCloseTable = computed(() => {
	return false
})

const headerBackground = computed(() => {
	return props.task.settings.headerBackgroundDark ? 'bg-paper-200 dark:bg-carbon-200' : ''
})

const titleStyle = computed(() => {
	return {
		paddingLeft: '6px',
		paddingRight: '4px',
		textAlign: settings.value.titleAlign || 'left',
		fontSize: (settings.value.titleFontSize || '14') + 'px',
		color: settings.value.titleFontColor || 'inherit',
		fontWeight: settings.value.titleBold ? 'bold' : 'normal'
	}
})

const settings = computed<ReportTaskSettingsType>(() => {
	return props.task.settings
})
</script>
