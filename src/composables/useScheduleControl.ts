import useApi from '@/composables/useApi'

type ScheduleControl = {
	appId: string
	flowId: string
	type: 'flow'
}

export default () => {
	const bootstrapSchedule = (scheduleControl: ScheduleControl[]) => {
		useApi().post('/api/schedule/bootstrap', {
			body: { scheduleControl }
		})
	}

	return {
		bootstrapSchedule
	}
}
