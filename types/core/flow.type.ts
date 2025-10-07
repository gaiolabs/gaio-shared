export type PositionType = {
	x: number
	y: number
}
export type NodeType = Partial<{
	id: string
	type: string
	label: string
	position: PositionType
	keyList?: string[]
	paramReferences?: Array<{ paramName: string; reference: string }>
	[key: string]: any
}>

type EdgeType = {
	id: string
	source: string
	target: string
	edgeType: string
	type?: string
}

export type WorkflowType = {
	nodes: NodeType[]
	tools: NodeType[]
	edges: EdgeType[]
}

export type CronBaseType = Partial<{
	status: 'active' | 'inactive'
	every: number
	current: string
	minuteValues: number[]
	hourValues: number[]
	dayValues: number[]
	dayOfMonthValues: number[]
	monthValues: number[]
}>

export type FlowType = Partial<{
	flowId: string
	appId: string
	flowName: string
	cron: string
	status: 'active' | 'inactive' | string
	cronBase: CronBaseType
	cronStatus: 'active' | 'inactive'
	user: Partial<{
		name: string
		userId: string
	}>
	options: Partial<{
		showDashboardHeader: boolean
		icon: string
		color: string
		dashboardType: string
		flowTimeout: number
		flowReload: number
		dialogWidth: number
		dialogHeight: number
		dialogOnDestroy: 'none' | 'resetFlow' | 'resetParams' | 'resetParamsAndFlow'
		metaId: string
	}>
	flowOrder: number
	flowStart: number
	flowType: string // 'infoPub', 'dataPrep', 'smart'
	flowKey: string
	flowDescription: string
	locked: boolean
	workflow: WorkflowType

	modifiedBy: string
	createdBy: string
	modifiedAt: Date
	createdAt: Date
}>
