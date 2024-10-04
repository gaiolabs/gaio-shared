<template>
	<header
		id="board-header"
		class="absolute left-0 right-0 top-0 z-30 w-full p-4 px-8"
	>
		<GCard class="rounded-2xl flex items-center justify-between gap-1 p-2">
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

				<div class="flex items-center justify-center -my-1">
					<GAppIcon
						class="text-xl size-10"
						:name="app.options.icon"
						:color="app.options.color"
					/>
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
		</GCard>
	</header>
</template>

<script setup lang="ts">
import GCard from '@/components/GCard.vue'
import IconComponent from '@/components/icons/IconComponent.vue'
import useApi from '@/composables/useApi'
// import useHelper from '@/composables/useHelper'
import { useAppStore } from '@/stores'
import type { AppType } from '@gaio/shared/types'
import { computed } from 'vue'

const app = computed<AppType>(() => useAppStore().app as AppType)
const currentFlow = computed(() => useAppStore().flow)
defineEmits(['open'])
// const { executablesNodes } = useHelper()

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
