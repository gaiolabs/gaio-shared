export type PositionType = {
    x: number
    y: number
}
export type NodeType = Partial<{
    id: string
    type: string
    label: string
    position: PositionType
    [key: string]: any
}>

type EdgeType = {
    id: string
    source: string
    target: string
    type?: string
}

export type WorkflowType = {
    nodes: NodeType[]
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
    cronBase: CronBaseType
    cronStatus: 'active' | 'inactive'
    options: {
        dashboardType: string
        flowTimeout: number
        flowReload: number
        dialogWidth: number
        dialogOnDestroy: 'none' | 'resetFlow' | 'resetParams' | 'resetParamsAndFlow'
    }
    flowOrder: number
    flowStart: number
    flowType: string
    flowKey: string
    flowDescription: string
    locked: boolean
    workflow: WorkflowType

    modifiedBy: string
    createdBy: string
    modifiedAt: Date
    createdAt: Date
}>
