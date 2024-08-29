<template>
	<div class="board-header absolute left-0 right-0 top-0 z-30 w-full pt-2">
		<g-card class="mx-[36px] rounded-[5px] border-elevation-2 bg-paper-100 dark:bg-carbon-200">
			<div class="flex items-center justify-between gap-1">
				<!--LEFT ACTIONS-->
				<div class="flex items-center gap-2">
					<n-button
						secondary
						size="tiny"
						@click="$router.push('/apps')"
					>
						<template #icon>
							<g-icon name="arrowLeft" />
						</template>
					</n-button>
					<n-divider
						vertical
						class="m-0 p-0"
					/>
					<n-button
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
					</n-button>
					<n-button
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
					</n-button>
					<n-divider vertical />
					<!--RUNNERS-->
					<n-button
						size="tiny"
						quaternary
						@click="run()"
					>
						<g-icon
							name="run"
							:height="16"
						/>
					</n-button>
					<n-button
						quaternary
						size="tiny"
						@click="runFromHere()"
					>
						<g-icon
							name="runFromHere"
							:height="17"
						/>
					</n-button>
					<n-button
						quaternary
						size="tiny"
						@click="runAll()"
					>
						<g-icon
							name="runAll"
							:height="19"
						/>
					</n-button>
					<n-divider
						vertical
						class="m-0 p-0"
					/>
					<n-button
						strong
						secondary
						type="success"
						size="tiny"
						@click="$emit('open', { taskLog: true })"
					>
						{{ $t('logs') }}
					</n-button>
				</div>
				<!--RIGHT ACTIONS-->
				<div class="flex items-center gap-2">
					<n-button
						size="tiny"
						@click="$router.push('/preview')"
					>
						<g-icon name="addAction" />
					</n-button>
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
			meta: {
				appId: useAppStore().app.appId,
				flowId: useAppStore().flow.flowId
			},
			params: useAppStore().app.params,
			tasks: useAppStore().flow.workflow.nodes.filter((node) => {
				return executablesNodes.includes(node.type)
			})
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
