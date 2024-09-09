import useApi from '@/composables/useApi'
import type { ScheduleList } from '@gaio/shared/types/dtos/flow'

export default () => {
	const defineInsightSchedules = (scheduleList: ScheduleList) => {
		useApi().post('/api/insight/save-schedules', {
			body: { scheduleList }
		})
	}

	const defineFlowSchedules = (scheduleList: ScheduleList) => {
		useApi().post('/api/flow/save-schedules', {
			body: { scheduleList }
		})
	}

	return {
		defineFlowSchedules,
		defineInsightSchedules
	}
}
