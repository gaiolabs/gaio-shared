import useApi from '@/composables/useApi'
import type { SchedulesList } from '@gaio/shared/types'

export default () => {
	const defineInsightSchedules = (schedulesList: SchedulesList) => {
		useApi().post('api/insight/save-schedules', {
			body: { schedulesList }
		})
	}

	const defineFlowSchedules = (schedulesList: SchedulesList) => {
		useApi().post('api/flow/save-schedules', {
			body: { schedulesList }
		})
	}

	return {
		defineFlowSchedules,
		defineInsightSchedules
	}
}
