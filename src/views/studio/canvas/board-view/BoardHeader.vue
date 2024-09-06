<template>
	<div class="board-header absolute left-0 right-0 top-0 z-30 w-full pt-2">
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
							<g-icon name="arrowLeft" />
						</template>
					</NButton>
					<NDivider
						vertical
						class="m-0 p-0"
					/>
					<NButton
						v-if="app?.options?.color"
						size="tiny"
						ghost
					>
						<template #icon>
							<g-icon
								name="apps"
								:color="app.options.color"
							/>
						</template>
					</NButton>
					<NButton
						size="tiny"
						secondary
						block
						class="max-w-[150px] truncate"
					>
						<template #icon>
							<g-icon name="flow" />
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
						<g-icon
							name="run"
							:height="16"
						/>
					</NButton>
					<NButton
						quaternary
						size="tiny"
						@click="runFromHere()"
					>
						<g-icon
							name="runFromHere"
							:height="17"
						/>
					</NButton>
					<NButton
						quaternary
						size="tiny"
						@click="runAll()"
					>
						<g-icon
							name="runAll"
							:height="19"
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
						<g-icon name="addAction" />
					</NButton>
				</div>
			</div>
		</g-card>
	</div>
</template>

<script setup lang="ts">
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
			params: useAppStore().app.params
		}
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
