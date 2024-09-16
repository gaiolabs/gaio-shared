<template>
	<div class="task-query">
		<DrawerView
			:only-full-screen="true"
			@close="$emit('close')"
		>
			<template #header>
				<TaskQueryMenu
					:local-task="localTask"
					@execute="execute()"
					@close="$emit('close')"
				/>
			</template>
			<template #content>
				<div class="w-full">
					<Splitpanes class="w-full">
						<Pane
							:size="20"
							class="p-2 flex flex-col bg-blue-400"
						>
							<div class="bg-white">asd</div>
						</Pane>
						<Pane :size="80">
							<Splitpanes
								class="w-full"
								horizontal
							>
								<pane>
									<code-editor v-model="localTask.query" />
								</pane>
								<pane>
									<div class="bg-white">
										<TaskQueryResult
											:result="result"
											:local-task="localTask"
										/>
									</div>
								</pane>
							</Splitpanes>
						</Pane>
					</Splitpanes>
				</div>
			</template>
		</DrawerView>
	</div>
</template>

<script setup lang="ts">
import DrawerView from '@/components/drawer/DrawerView.vue'
import useDefault from '@/composables/useDefault'
import { useAppStore } from '@/stores'
import TaskQueryMenu from '@/views/studio/canvas/task-query/TaskQueryMenu.vue'
// import TaskQuerySideBar from '@/views/studio/canvas/task-query/components/TaskQuerySideBar.vue'
import TaskQueryResult from '@/views/studio/canvas/task-query/TaskQueryResult.vue'
import { Pane, Splitpanes } from 'splitpanes'

defineEmits(['close'])

const localTask = ref()
const result = ref()

const panels = ref({
	left: true,
	right: true
})

const execute = () => {}

onBeforeMount(() => {
	localTask.value = useDefault({
		type: 'query',
		base: {
			...useAppStore().appInfo,
			...useAppStore().cloneTask()
		}
	})
	// viewControl.init()
})
</script>
