import type { FlowType } from '@gaio/shared/types'

export type GridOptionsType = {
	editGrid: boolean
	viewPortSize: Partial<{
		width: string
		margin: string
		border: string
	}>
	refreshLayoutKey: string
	currentLayout: 'lg' | 'md' | 'sm'
}

export type ActionType = {
	formType?: string
	flowId?: string
	formFlowId?: number
	formReload?: boolean
	formResetParams?: boolean
}

export type DashFlowItem = Partial<{
	refreshKey: string
}> &
	FlowType
