<template>
	<div id="task-query">
		<DrawerView @close="$emit('close')">
			<template #header>
				<TaskQueryMenu
					:local-task="localTask"
					@execute="execute()"
					@close="$emit('close')"
				/>
			</template>
			<template #content>
				<div class="w-full flex-1">
					<NSplit
						direction="horizontal"
						default-size="240px"
					>
						<template #1>
							<div class="h-full flex flex-col gap-2 p-2">
								<h3 class="pb-0 font-semibold text-gray-900 py-2 px-1">
									{{ $t('sources') }}
								</h3>
								<aside class="bg-white shadow-xl rounded-xl flex-1 p-2">Teste</aside>
							</div>
						</template>
						<template #2>
							<NSplit direction="vertical">
								<template #1>
									<div class="w-full h-full flex flex-col p-2 pt-0">
										<NTabs
											type="line"
											class="h-full"
											:tabs-padding="8"
											suffix="tab"
										>
											<NTabPane
												name="task"
												tab="Task"
												class="bg-white rounded-xl shadow-xl h-full overflow-auto"
											>
												<div class="p-2 -h-52">
													<CodeEditor
														v-model="localTask.query"
														class="bg-gray-900 h-full rounded-md"
														style=""
													/>
												</div>
											</NTabPane>
											<n-tab-pane
												name="query2"
												tab="Query #2"
												class="bg-white rounded-xl shadow-xl h-full overflow-auto"
											>
												<div class="p-2 -h-52">
													<CodeEditor
														v-model="localTask.query"
														class="bg-gray-900 h-full rounded-md"
														style=""
													/>
												</div>
											</n-tab-pane>
											<n-tab-pane
												name="query3"
												tab="Query #3"
												class="bg-white rounded-xl shadow-xl h-full overflow-auto"
											>
												<div class="p-2 -h-52">
													<CodeEditor
														v-model="localTask.query"
														class="bg-gray-900 h-full rounded-md"
														style=""
													/>
												</div>
											</n-tab-pane>
										</NTabs>
									</div>
								</template>
								<template #2>
									<div class="flex p-2 h-full items-start overflow-auto">
										<footer class="bg-white p-2 rounded-xl shadow-xl h-auto w-full p-2">
											<n-alert type="info">Use the field above to create and execute an SQL command.</n-alert>
										</footer>
									</div>
								</template>
							</NSplit>
						</template>
					</NSplit>
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

defineEmits(['close'])

const localTask = ref()
const result = ref([])

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
