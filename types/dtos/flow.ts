import { FlowType } from '../core/flow.type'

/**
 * @description Request Data Transfer Object for Task routes
 *
 * It's basically the object format used in the body of the request
 *
 * @namingConvention ScopeRouteNameRequestDTO
 */

export type FlowSaveRequestDTO = { flowData: FlowType }
export type FlowSaveSchedulesRequestDTO = { schedulesList: Array<{ appId: string; flowId: string }> }
export type FlowListRequestDTO = { appId: string }
export type FlowRemoveRequestDTO = { flowId: string; appId: string }
export type FlowCloneRequestDTO = { flowId: string; appId: string }
export type FlowRenewFlowKeyRequestDTO = { flowId: string; appId: string }
export type FlowUpdateOrderRequestDTO = { flowList: string[]; appId: string }
