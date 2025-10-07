/**
 * @description Refers to the "flow" schema from database
 */
export type FlowEntity = {
	flowId: string
	flowName: string
	flowDescription: string
	flowKey: string
	flowType: string // 'dataPrep',
	locked: boolean
	flowOrder: number // 0
	flowNumber: number // 0
	status: string // 'active',
	cron: string
	cronStatus: string // 'active',
	cronBase: string
	workflow: string // '{"nodes":[],"edges":[]}',
	options: string // '{}',
	appId: string
	createdBy: string
	modifiedBy: string
	createdAt: Date
	updatedAt: Date
}
