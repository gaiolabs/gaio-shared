<template>
	<nav class="task-query-menu flex w-full items-center gap-3 px-0">
		<div class="flex items-center gap-1 text-lg font-bold">
			<div class="w-5 h-5 bg-black/10 border-2 border-black"></div>
			{{ $t('query') }}
		</div>
		<div class="flex grow items-center justify-between gap-2 px-3">
			<div class="flex items-center gap-2">
				<NButton
					:disabled="!localTask.label"
					size="small"
					@click="save()"
				>
					{{ $t('save') }}
				</NButton>

				<NDivider vertical />
				<NInput
					v-model:value="localTask.label"
					size="small"
					:placeholder="$t('sqlQuery')"
				/>
				<NDivider vertical />

				<NButton
					size="small"
					strong
					secondary
					type="primary"
					@click="$emit('execute')"
				>
					{{ $t('run') }}
				</NButton>
			</div>
			<div class="flex items-center justify-between gap-2">
				<NTooltip :show-after="1500">
					<template #trigger>
						<!-- :type="viewControl.showPreviewModal ? 'primary' : 'default'" -->
						<!-- @click="viewControl.toggleShowPreviewModal" -->
						<NButton
							secondary
							class="border-elevation-2"
						>
							<GIcon name="eye" />
						</NButton>
					</template>
					{{ $t('toggleLeftMenu') }}
				</NTooltip>

				<NTooltip :show-after="1500">
					<template #trigger>
						<!-- :type="!viewControl.showSideBar ? 'primary' : 'default'" -->
						<!-- @click="viewControl.toggleShowSideBar" -->
						<NButton
							title="Tooltip directive content"
							secondary
							class="border-elevation-2"
						>
							<GIcon name="panelLeft" />
						</NButton>
					</template>
					{{ $t('toggleLeftMenu') }}
				</NTooltip>

				<NTooltip :show-after="1500">
					<template #trigger>
						<!-- :type="!viewControl.showPreview ? 'primary' : 'default'" -->
						<!-- @click="viewControl.toggleShowPreview" -->
						<NButton
							secondary
							class="border-elevation-2"
						>
							<GIcon name="panelRight" />
						</NButton>
					</template>
					{{ $t('toggleRightMenu') }}
				</NTooltip>
				<NDivider vertical />
			</div>
		</div>
	</nav>
</template>

<script setup lang="ts">
import GIcon from '@/components/GIcon.vue'
import useFlow from '@/composables/useFlow'
import { useAppStore } from '@/stores'
import { NButton, NDivider, NInput, NTooltip } from 'naive-ui'

const emit = defineEmits(['close', 'execute'])
const { localTask = null } = defineProps<{ localTask: GenericType }>()

const save = () => {
	useFlow(useAppStore().flow.workflow)
		.generate({
			task: localTask,
			sources: [],
			targets: []
		})
		.save()
		.then(() => emit('close'))
}
</script>
