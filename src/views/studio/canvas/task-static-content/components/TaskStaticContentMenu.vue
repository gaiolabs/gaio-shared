<template>
	<TaskStaticContentPreviewModal />
	<div class="task-builder-menu flex w-full items-center gap-3 p-3 px-0">
		<div class="flex items-center gap-1 text-lg font-bold">
			<GIcon name="staticContent" />
			{{ $t('content') }}
		</div>
		<div class="flex grow items-center justify-between gap-2 px-3">
			<div class="flex items-center gap-2">
				<NInput
					v-model:value="codeData.localTask.label"
					size="small"
					:placeholder="$t('task')"
				/>
				<NDivider vertical />
				<NButton
					size="small"
					@click="save()"
				>
					{{ $t('save') }}
				</NButton>
			</div>
			<div class="flex items-center justify-between gap-2">
				<NTooltip :show-after="1500">
					<template #trigger>
						<NButton
							:type="viewControl.showPreviewModal ? 'primary' : 'default'"
							secondary
							class="border-elevation-2"
							@click="viewControl.toggleShowPreviewModal"
						>
							<GIcon name="eye" />
						</NButton>
					</template>
					{{ $t('preview') }}
				</NTooltip>

				<NTooltip :show-after="1500">
					<template #trigger>
						<NButton
							title="Tooltip directive content"
							:type="!viewControl.showSideBar ? 'primary' : 'default'"
							secondary
							class="border-elevation-2"
							@click="viewControl.toggleShowSideBar"
						>
							<GIcon name="panelLeft" />
						</NButton>
					</template>
					{{ $t('toggleLeftMenu') }}
				</NTooltip>

				<NTooltip :show-after="1500">
					<template #trigger>
						<NButton
							:type="!viewControl.showPreview ? 'primary' : 'default'"
							secondary
							class="border-elevation-2"
							@click="viewControl.toggleShowPreview"
						>
							<GIcon name="panelRight" />
						</NButton>
					</template>
					{{ $t('toggleRightMenu') }}
				</NTooltip>
				<NDivider vertical />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import GIcon from '@/components/GIcon.vue'
import useFlow from '@/composables/useFlow'
import { useAppStore } from '@/stores'
import { NInput, NButton, NTooltip, NDivider } from 'naive-ui'
import { useCodeDataStore, useViewControlStore } from '../store/useTaskStaticContentStore'
import TaskStaticContentPreviewModal from './TaskStaticContentPreviewModal.vue'

const emit = defineEmits(['close'])
const viewControl = useViewControlStore()
const codeData = useCodeDataStore()

const save = () => {
	useFlow(useAppStore().flow.workflow)
		.generate({
			task: codeData.localTask,
			sources: [],
			targets: []
		})
		.save()
		.then(() => emit('close'))
}
</script>
