export type AgentType = Partial<{
	agentId: string
	avatar: string
	name: string
	description: string
	role: string
	goal: string
	backstory: string
	options: string
	settings: string
	appId: string
	createdAt: string // ISO string or Date object
	updatedAt: string // ISO string or Date object
	createdBy: string
	updatedBy: string
}>
