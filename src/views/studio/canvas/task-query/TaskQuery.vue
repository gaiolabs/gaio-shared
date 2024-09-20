<template>
	<div
		id="taskQuery"
		class="overflow-hidden"
	>
		<DrawerView @close="$emit('close')">
			<template #header>
				<TaskQueryMenu
					:local-task="localTask"
					@execute="execute()"
					@close="$emit('close')"
				/>
			</template>
			<template #content>
				<div class="w-full h-full">
					<Splitpanes vertical>
						<Pane size="16">
							<div class="h-full flex flex-col gap-2 p-2">
								<h3 class="pb-0 font-semibold text-gray-900 py-2 px-1">
									{{ $t('sources') }}
								</h3>
								<aside class="bg-white shadow-lg rounded-xl flex-1 p-3">Teste</aside>
							</div>
						</Pane>
						<Pane>
							<Splitpanes horizontal>
								<Pane min-size="25">
									<div class="w-full h-full flex flex-col p-2">
										<header class="">
											<ul class="flex">
												<li
													v-for="(tab, index) in tabs"
													:key="tab.key"
													:style="{ zIndex: tab.key === currentTab ? tabs.length + 1 : tabs.length - index }"
													class="px-4 py-2 transition-colors duration-150 rounded-t-xl flex gap-2 cursor-pointer"
													:class="tab.key === currentTab ? 'bg-white shadow-md' : ''"
													@click="currentTab = tab.key"
												>
													<span
														class="font-medium"
														:class="tab.key === currentTab ? 'text-gray-900' : 'text-gray-600'"
													>
														{{ tab.label }}
													</span>
													<button class="opacity-25 hover:opacity-100 duration-150 transition-opacity">x</button>
												</li>
											</ul>
										</header>
										<div
											class="bg-white shadow-md rounded-xl h-full w-full p-2 z-20"
											:class="currentTab === tabs[0].key ? 'rounded-tl-none' : ''"
										>
											<!-- <CodeEditor
												v-model="localTask.query"
												class="bg-gray-900 h-full rounded-md"
												style=""
											/> -->
										</div>
									</div>
								</Pane>
								<Pane min-size="15">
									<div class="flex p-2 h-full items-start overflow-auto">
										<footer class="bg-white p-2 rounded-xl shadow-md h-auto w-full p-2">
											<n-alert
												v-if="!result.length"
												type="info"
											>
												Use the field above to create and execute an SQL command.
											</n-alert>
											{{ result }}
										</footer>
									</div>
								</Pane>
							</Splitpanes>
						</Pane>
					</Splitpanes>
					<!-- <Splitpanes class="w-full bg-blue-500 p-2">
						<Pane
							:size="20"
							class="p-2 flex flex-col bg-green-500"
						>
							<h3 class="font-semibold pt-3">{{ $t('sources') }}</h3>
							<div class="bg-white shadow-md rounded-lg h-screen">asd</div>
						</Pane>
						<Pane
							:size="80"
							class="bg-white"
						>
							<Splitpanes
								class="w-full bg-red-500"
								horizontal
							>
								<pane
									:size="20"
									class="bg-yellow-500"
								>
									<code-editor v-model="localTask.query" />
								</pane>
								<pane
									:size="80"
									class="bg-green-500"
								>
									<div class="bg-white">
										{{ result }}
										<TaskQueryResult
											v-if="result.length > 0"
											:result="result"
											:local-task="localTask"
										/>
									</div>
								</pane>
							</Splitpanes>
						</Pane>
					</Splitpanes> -->
				</div>
			</template>
		</DrawerView>
	</div>
</template>

<script setup lang="ts">
import CodeEditor from '@/components/code-editor/CodeEditor.vue'
import DrawerView from '@/components/drawer/DrawerView.vue'
import useApi from '@/composables/useApi'
import useDefault from '@/composables/useDefault'
import { useAppStore } from '@/stores'
import TaskQueryMenu from '@/views/studio/canvas/task-query/TaskQueryMenu.vue'
// import TaskQuerySideBar from '@/views/studio/canvas/task-query/components/TaskQuerySideBar.vue'
import TaskQueryResult from '@/views/studio/canvas/task-query/TaskQueryResult.vue'
import { NSplit, NTabPane, NTabs } from 'naive-ui'
import { Pane, Splitpanes } from 'splitpanes'
import { useI18n } from 'vue-i18n'

defineEmits(['close'])

const localTask = ref()
const result = ref([])

const { t: $t } = useI18n()

const currentTab = ref('task')
const tabs = ref([
	{
		label: $t('task'),
		key: 'task'
	},
	{
		label: 'Query #2',
		key: 'query2'
	},
	{
		label: 'Query #3',
		key: 'query3'
	}
])

const panels = ref({
	left: true,
	right: true
})

const execute = () => {
	console.log('case')
	useApi()
		.post('api/task/query', {
			body: {
				taskData: localTask.value
			}
		})
		.then((res) => {
			result.value = [
				[
					{
						name: 'name',
						type: 'string'
					},
					{
						name: 'age',
						type: 'number'
					},
					{
						name: 'address',
						type: 'string'
					}
				],
				[
					{
						name: 'John',
						age: 30,
						address: 'New York'
					},
					{
						name: 'Doe',
						age: 25,
						address: 'California'
					}
				],
				[
					{
						name: 'John',
						age: 30,
						address: 'New York'
					},
					{
						name: 'Doe',
						age: 25,
						address: 'California'
					}
				]
			]
			// result.value = res.data
		})
		.catch((err) => {
			console.log('jonafdasofasdofasofdo')
			result.value = [
				[
					{
						name: 'name',
						type: 'string'
					},
					{
						name: 'age',
						type: 'number'
					},
					{
						name: 'address',
						type: 'string'
					}
				],
				[
					{
						name: 'John',
						age: 30,
						address: 'New York'
					},
					{
						name: 'Doe',
						age: 25,
						address: 'California'
					}
				],
				[
					{
						name: 'John',
						age: 30,
						address: 'New York'
					},
					{
						name: 'Doe',
						age: 25,
						address: 'California'
					}
				]
			]
			console.log(err)
		})
}

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
