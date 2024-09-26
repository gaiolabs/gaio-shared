<template>
	<header
		id="board-header"
		class="absolute left-0 right-0 top-0 z-30 w-full pt-2"
	>
		<g-card class="mx-[36px] rounded-[5px] border-elevation-2 bg-paper-100 dark:bg-carbon-200">
			<div class="flex items-center justify-between gap-1">
				<!--LEFT ACTIONS-->
				<div class="flex items-center gap-2">
					<NButton
						secondary
						size="tiny"
						@click="$router.push('/apps')"
					>
						<template #icon>
							<IconComponent name="ChevronLeft" />
						</template>
					</NButton>

					<div class="relative px-2 flex items-center justify-center">
						<GAppIcon
							class="text-xl"
							:name="app.options.icon"
							:color="app.options.color"
						/>
						<div
							class="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300 z-0 rounded"
							:style="{
								backgroundColor: app.options.color,
							}"
						></div>
					</div>
					<NButton
						size="tiny"
						secondary
						block
						class="max-w-[150px] truncate"
					>
						<template #icon>
							<IconComponent
								name="Studio"
								class="rotate-[-90deg]"
							/>
						</template>
						<div class="flex items-center text-[14px] font-bold">
							{{ currentFlow?.flowName }}
						</div>
					</NButton>
					<NDivider vertical />
					<!--RUNNERS-->
					<NButton
						size="tiny"
						quaternary
						@click="run()"
					>
						<IconComponent
							class="w-4 h-4"
							name="Run"
						/>
					</NButton>
					<NButton
						quaternary
						size="tiny"
						@click="runFromHere()"
					>
						<IconComponent
							class="w-4 h-4"
							name="RunFromHere"
						/>
					</NButton>
					<NButton
						quaternary
						size="tiny"
						@click="runAll()"
					>
						<IconComponent
							class="w-4 h-4"
							name="RunAll"
						/>
					</NButton>
					<NDivider
						vertical
						class="m-0 p-0"
					/>
					<NButton
						strong
						secondary
						type="success"
						size="tiny"
						@click="$emit('open', { taskLog: true })"
					>
						{{ $t('monitor') }}
					</NButton>
				</div>
				<!--RIGHT ACTIONS-->
				<div class="flex items-center gap-2">
					<NButton
						size="tiny"
						@click="$router.push('/preview')"
					>
						<template #icon>
							<IconComponent name="AddAction" />
						</template>
					</NButton>
				</div>
			</div>
		</g-card>
	</header>
</template>

<script setup lang="ts">
import IconComponent from '@/components/icons/IconComponent.vue'
import useApi from '@/composables/useApi'
import useHelper from '@/composables/useHelper'
import { useAppStore } from '@/stores'
import type { AppType } from '@gaio/shared/types'
import { computed } from 'vue'

const app = computed<AppType>(() => useAppStore().app as AppType)
const currentFlow = computed(() => useAppStore().flow)
defineEmits(['open'])
const { executablesNodes } = useHelper()

const runAll = () => {
	useApi().post(`api/task/run-all`, {
		body: {
			from: 'studio',
			appId: useAppStore().app.appId,
			flowId: useAppStore().flow.flowId,
			params: useAppStore().app.params,
		},
	})
	console.log('run all')
}

const runFromHere = () => {
	console.log('run from here')
}

const run = () => {
	console.log('run')
}
</script>
