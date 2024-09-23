import type { ReportNodeType } from '@gaio/shared/types'
import type { XAXisOption, YAXisOption } from 'echarts/types/dist/shared'

export default (task: ReportNodeType) => {
	const settings = computed(() => task.settings || {})

	const commonXAxisConfigs = (ticksLabels: (string | number | Date)[], name: string) => {
		return {
			axisTick: {
				alignWithLabel: true,
				customValues: settings.value.xAxisTickCount === 0 ? undefined : ticksLabels,
			},
			axisLine: {
				show: settings.value.showXLine,
			},
			splitLine: {
				show: settings.value.showXGrid,
			},
			name: settings.value.showXTitle ? name : undefined,
			nameLocation: 'middle',
			nameTextStyle: {
				align: 'center',
				padding: [16, 0, 0, 0],
			},
			axisLabel: {
				show: settings.value.showXAxis,
				customValues: settings.value.xAxisTickCount === 0 ? undefined : ticksLabels,
			},
		} as XAXisOption | XAXisOption[]
	}

	const commonYAxisConfigs = (ticksLabels: (string | number | Date)[], name: string) => {
		return {
			axisTick: {
				alignWithLabel: true,
				customValues: settings.value.yAxisTickCount === 0 ? undefined : ticksLabels,
			},
			axisLine: {
				show: settings.value.showYLine,
			},
			splitLine: {
				show: settings.value.showYGrid,
			},
			name: settings.value.showYTitle ? name : undefined,
			nameLocation: 'middle',
			nameTextStyle: {
				align: 'center',
				padding: [0, 0, 80, 0],
			},
			axisLabel: {
				show: settings.value.showYAxis,
				customValues: settings.value.yAxisTickCount === 0 ? undefined : ticksLabels,
			},
		} as YAXisOption | YAXisOption[]
	}

	return { commonXAxisConfigs, commonYAxisConfigs }
}
