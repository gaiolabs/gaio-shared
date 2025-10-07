import { NodeType } from '../core/flow.type'
import { ParamType } from '../core/param.type'

/**
 * @description Request Data Transfer Object for Task routes
 *
 * It's basically the object format used in the body of the request
 *
 * @namingConvention ScopeRouteNameRequestDTO
 */

// type RunRequestDTO = {}
// type RunFromHereRequestDTO = {}
// type TestRestRequestDTO = {}
export type TaskRunAllRequestDTO = {
	from: string
	meta: {
		appId: string
		flowId: string
	}
	params: Array<ParamType>
	tasks: Array<NodeType>
}
export type TaskLogsRequestDTO = { appId: string }
export type TaskAbortRequestDTO = { id: string }
export type TaskStatusRequestDTO = { appId: string }
// type CustomParamRequestDTO = {}

// type RunResponseDTO = {}
// type RunFromHereResponseDTO = {}
// type TestRestResponseDTO = {}
// type RunAllResponseDTO = {}
// type LogsResponseDTO = {}
// type AbortResponseDTO = {}
// type StatusResponseDTO = {}
// type CustomParamResponseDTO = {}
