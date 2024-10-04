<template>
	<header
		id="board-header"
		class="absolute left-0 right-0 top-0 z-30 w-full p-4 px-8 pointer-events-none"
	>
		<GCard
			type="wrapper"
			class="rounded-2xl flex items-center justify-between gap-4 px-3"
		>
			<div class="flex items-center gap-4">
				<!-- Back Button -->
				<NButton
					id="back-button"
					secondary
					size="tiny"
					@click="$router.push('/apps')"
				>
					<template #icon>
						<IconComponent name="ChevronLeft" />
					</template>
				</NButton>

				<!-- App identifier -->
				<div
					id="app-name"
					class="flex gap-2 px-4 border-x border-gray-200 dark:border-white/10"
				>
					<div class="flex items-center justify-center -my-1">
						<GAppIcon
							class="text-xl size-8"
							:name="app.options.icon"
							:color="app.options.color"
						/>
					</div>
					<GCard class="max-w-[150px] truncate flex gap-2 g-base p-1 px-2 rounded-lg">
						<IconComponent
							name="Studio"
							class="rotate-[-90deg]"
						/>

						<div class="flex items-center text-[14px] font-bold">
							{{ currentFlow?.flowName }}
						</div>
					</GCard>
				</div>

				<!-- Actions -->
				<nav
					id="actions"
					class="flex"
				>
					<GButton
						type="tertiary"
						class="!p-4 -ml-3"
						@click="run()"
					>
						<IconComponent name="Run" />
					</GButton>
					<GButton
						type="tertiary"
						class="!p-4 -ml-3"
						@click="runFromHere()"
					>
						<IconComponent name="RunFromHere" />
					</GButton>
					<GButton
						type="tertiary"
						class="!p-4 -ml-3"
						@click="runAll()"
					>
						<IconComponent name="RunAll" />
					</GButton>
				</nav>

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

			<div class="flex items-center gap-2 border-l border-gray-200 dark:border-white/10 pl-4">
				<GButton
					size="small"
					type="secondary"
					square
					@click="$router.push('/preview')"
				>
					<IconComponent name="AddAction" />
				</GButton>
				<GButton
					size="small"
					type="secondary"
					square
					@click="$router.push('/preview')"
				>
					<IconComponent name="AddAction" />
				</GButton>
				<div class="size-9 rounded-full bg-gray-500"></div>
			</div>
		</GCard>
	</header>
</template>

<script setup lang="ts">
import GCard from '@/components/GCard.vue'
import IconComponent from '@/components/icons/IconComponent.vue'
import GButton from '@/components/inputs/GButton.vue'
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
