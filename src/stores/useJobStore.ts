import useApi from '@/composables/useApi'
import { useAppStore } from '@/stores/useAppStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { defineStore } from 'pinia'

type JobType = {
	jobId: string
	taskId: string
	userId: string
	appId: string
	flowId: string
	status: 'started' | 'ended'
	startedAt: string
	endedAt: string
}
type JobListType = {
	taskLogId?: string
	appId?: string
	flowId: string
	userId?: string
	startedAt?: string
	endedAt?: string
	aborted?: boolean
	status?: 'started' | 'ended'
	tasks?: {
		[prop: string]: JobType
	}
}

export const useJobStore = defineStore('board', () => {
	const jobs = ref<JobListType[]>([])
	let source: WebSocket

	const useApp = useAppStore()

	const loadLogs = async () => {
		jobs.value = await useApi().post('api/task/logs', {
			body: {
				appId: useApp.app.appId
			}
		})
	}

	const closeEventSource = () => {
		if (source) {
			source.close()
			source = null
		}
	}

	const channel = computed(() => {
		return 'type:job-' + useAppStore().app.appId + '-' + useAuthStore().user.userId + '?token=' + useAuthStore().token
	})

	const initCanvasWebsockets = async () => {
		source = new WebSocket('http://localhost:3000/api/ws/' + channel.value)

		source.onopen = () => console.log('webscket connected')

		source.onmessage = (event) => {
			const incomingJob = JSON.parse(event.data)

			if (incomingJob?.taskData) {
				const jobListIndex = jobs.value.findIndex((job) => job.taskLogId === incomingJob.taskLogId)

				if (jobListIndex === -1) {
					jobs.value.unshift({
						taskLogId: incomingJob.taskLogId,
						appId: incomingJob.appId,
						userId: incomingJob.userId,
						flowId: incomingJob.flowId,
						startedAt: incomingJob.startedAt,
						endedAt: incomingJob.endedAt,
						status: incomingJob.status,
						aborted: incomingJob.aborted,
						tasks: {
							[incomingJob.taskData.taskId]: incomingJob.taskData
						}
					})
				} else {
					jobs.value[jobListIndex].status = incomingJob.status
					jobs.value[jobListIndex].endedAt = incomingJob.endedAt
					jobs.value[jobListIndex].aborted = incomingJob.aborted
					if (incomingJob.taskData) {
						jobs.value[jobListIndex].tasks[incomingJob.taskData.taskId] = incomingJob.taskData
					}
				}
			}
		}
	}

	const initJobWatcher = async () => {
		await loadLogs()
		await initCanvasWebsockets()
	}

	const lastKey = ref(0)

	const lastJobTasks = computed(() => {
		if (jobs.value[lastKey.value]) {
			return jobs.value[lastKey.value].tasks
		}

		return {}
	})

	const jobList = computed(() => {
		return jobs.value
	})

	return { initJobWatcher, lastJobTasks, jobList, closeEventSource }
})
