import useApi from '@/composables/useApi'
import { useAuthStore } from '@/stores/useAuthStore'
import type { AppType, FlowType, FormType, ParamType, ReportNodeType, SourceType, TaskType } from '@gaio/shared/types'
import { getBucketNameFromAppId, getId } from '@gaio/shared/utils'
import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAppStore = defineStore(
	'app',
	() => {
		const refreshKey = ref('any')
		const flow = ref<FlowType>()
		const flowList = ref<FlowType[]>()
		const app = ref<AppType>()
		const task = ref<TaskType & ReportNodeType>()
		const params = ref<ParamType[]>([])
		const forms = ref<FormType[]>([])
		const sourceList = ref<SourceType[]>()
		let source: WebSocket

		const cloneTask = <T = TaskType & ReportNodeType>() => cloneDeep<T>(task.value as T)
		const baseTask = (type: string) => {
			const task = cloneTask() || ({} as TaskType)
			return {
				...appInfo.value,
				...task,
				id: task.type !== type ? getId() : task.id
			}
		}

		const appInfo = computed(() => {
			return {
				client: 'clickhouse',
				appId: app.value.appId,
				repoId: app.value.repoId,
				databaseName: getBucketNameFromAppId(app.value.appId)
			}
		})

		const defineCurrentFlow = (flowElement: string | FlowType) => {
			flow.value = typeof flowElement === 'string' ? flowList.value.find((f) => f.flowId === flowElement) : flowElement
		}

		const loadApp = async (appId = app.value.appId) => {
			const {
				app: appData,
				flowList: flowListData,
				sourceList: sourceListData
			} = await useApi().post('api/app/init', { body: { appId } })

			app.value = appData

			defineDefaultParams()

			forms.value = app.value.forms
			sourceList.value = sourceListData
			flowList.value = flowListData
			flow.value = flowListData[0]
		}

		const defineDefaultParams = () => {
			params.value = cloneDeep(app.value.params)
			params.value.unshift({
				paramName: 'userId',
				paramValue: useAuthStore().user.userId
			} as ParamType)
		}

		const saveAppMetadata = async (type: 'forms' | 'params') => {
			let url = undefined
			let dataToSave = undefined
			if (type === 'forms') {
				url = 'api/app/update-forms'
				dataToSave = forms.value
			} else if (type === 'params') {
				url = 'api/app/update-params'
				dataToSave = params.value
			}

			if (!url) return

			return await useApi().post(url, {
				body: {
					[type]: dataToSave,
					appId: app.value.appId
				}
			})
		}

		const saveAppOptions = async (options: Record<string, unknown>) => {
			return useApi().post('api/app/update-options', {
				body: {
					options: {
						...useAppStore().app.options,
						...options
					},
					appId: useAppStore().app.appId
				}
			})
		}

		const saveFlow = async (flowData?: FlowType) => {
			if (!flowData) {
				flowData = useAppStore().flow
			}
			return await useApi('saveFlowAppStore').post('api/flow/save', {
				body: {
					flowData
				}
			})
		}

		const closeEventSource = () => {
			if (source) {
				console.log('close app websocket')
				source.close()
				source = null
			}
		}

		const observeUpdateFlow = () => {
			source = new WebSocket(
				'http://localhost:3000/api/ws/' +
					'type:app-' +
					app.value.appId +
					'-' +
					useAuthStore().user.userId +
					'?token=' +
					useAuthStore().token
			)

			source.onmessage = (event) => {
				const incomingData: { type: string; data: FlowType & AppType } = JSON.parse(event.data)

				if (incomingData.type === 'flow') {
					const { flowData } = incomingData
					console.log('fasfasfas')
					if (flowData.flowId === flow.value.flowId) {
						for (const key in flowData) {
							console.log(key)
							if (flow.value[key]) {
								console.log('save ', key)
								flow.value[key] = flowData[key]
							}
						}
					}

					flow.value = cloneDeep(flow.value)

					flowList.value.forEach((flowItem, index) => {
						if (flowItem.flowId === flowData.flowId) {
							console.log('amigo')
							for (const key in flowData) {
								if (flowList.value[index][key]) {
									flowList.value[index][key] = flowData[key]
								}
							}
						}
					})

					refreshKey.value = getId()
				}
			}
		}

		// const updateParams = (paramState) => {
		//     const params = Object.assign([], paramState)
		//     const userId = useAuthStore().user.userId
		//     const userIndex = params.findIndex((p) => p.paramName === 'userId')
		//     if (userIndex === -1) {
		//         params.push({
		//             paramId: 'userId',
		//             paramName: 'userId',
		//             paramValue: userId
		//         })
		//     } else {
		//         const name = String(router.currentRoute.value.name)
		//         if (['dash', 'home'].includes(`${name}`)) {
		//             params[userIndex].paramValue = userId
		//         }
		//     }
		// }

		return {
			app,
			task,
			flow,
			forms,
			params,
			appInfo,
			flowList,
			refreshKey,
			sourceList,
			loadApp,
			baseTask,
			saveFlow,
			cloneTask,
			saveAppOptions,
			saveAppMetadata,
			defineCurrentFlow,
			defineDefaultParams,
			observeUpdateFlow,
			closeEventSource
		}
	},
	{
		persist: { paths: ['app.appId', 'sourceList', 'app.repoId', 'flow.flowId'] }
	}
)
