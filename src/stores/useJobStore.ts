import useApi from '@/composables/useApi'
import { useAppStore } from '@/stores/useAppStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
	id?: string
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
	let source

	const useAuth = useAuthStore()
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

	const initJobWatcher = async () => {
		await loadLogs()
		source = new EventSource(
			'http://localhost:3000/api/task/status/?appId=' + useApp.app.appId + '&gaioToken=' + useAuth.token
		)
		source.onmessage = function (event) {
			const incomingJob = JSON.parse(event.data)

			if (incomingJob?.taskData) {
				const jobListIndex = jobs.value.findIndex((job) => job.id === incomingJob.id)

				if (jobListIndex === -1) {
					jobs.value.unshift({
						id: incomingJob.id,
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
