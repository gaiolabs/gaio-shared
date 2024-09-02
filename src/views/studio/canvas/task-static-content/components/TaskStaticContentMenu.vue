<template>
	<TaskStaticContentPreviewModal />
	<div class="task-builder-menu flex w-full items-center gap-3 p-3 px-0">
		<div class="flex items-center gap-1 text-lg font-bold">
			<GIcon name="staticContent" />
			{{ $t('content') }}
		</div>
		<div class="flex grow items-center justify-between gap-2 px-3">
			<div class="flex items-center gap-2">
				<NInput v-model:value="localTask.label" size="small" :placeholder="$t('task')" />
				<NDivider vertical />
				<NButton size="small" @click="save()">
					{{ $t('save') }}
				</NButton>
			</div>
			<div class="flex items-center justify-between gap-2">
				<NTooltip :show-after="1500">
					<template #trigger>
						<NButton
							:type="viewControlStore.showPreviewModal ? 'primary' : 'default'"
							secondary
							class="border-elevation-2"
							@click="viewControlStore.toggleShowPreviewModal"
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
							:type="!viewControlStore.showSideBar ? 'primary' : 'default'"
							secondary
							class="border-elevation-2"
							@click="viewControlStore.toggleShowSideBar"
						>
							<GIcon name="panelLeft" />
						</NButton>
					</template>
					{{ $t('toggleLeftMenu') }}
				</NTooltip>

				<NTooltip :show-after="1500">
					<template #trigger>
						<NButton
							:type="!viewControlStore.showPreview ? 'primary' : 'default'"
							secondary
							class="border-elevation-2"
							@click="viewControlStore.toggleShowPreview"
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
import useDefault from '@/composables/useDefault'
import { useAppStore } from '@/stores'
import type { StaticContentType } from '@gaio/shared/types/tasks/static-content.type'
import { getId } from '@gaio/shared/utils'
import { NInput, NButton, NTooltip, NDivider } from 'naive-ui'
import { type PropType } from 'vue'
import { useTaskStaticContentStore } from '../store/useTaskStaticContentStore'
import TaskStaticContentPreviewModal from './TaskStaticContentPreviewModal.vue'

const props = defineProps({
	localTask: {
		type: Object as PropType<StaticContentType>,
		required: true,
		default: () => ({}) as StaticContentType
	}
})

const viewControlStore = useTaskStaticContentStore()

const save = () => {
	const task = props.localTask
	if (task.id === undefined) task.id = getId()
	const taskToBeSaved = useDefault({
		type: 'staticContent',
		base: {
			...useAppStore().appInfo,
			...task
		}
	})

	console.log('task', task)
	console.log('taskToBeSaved', taskToBeSaved)
	// useFlow(useAppStore().flow.workflow)
	//     .generate({
	//         task: taskToBeSaved,
	//         sources: [],
	//         targets: []
	//     })
	//     .save()
	//     .then(() => emit('close'))
}
</script>
