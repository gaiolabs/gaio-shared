import { NodeType } from '../core/flow.type'
import { ParamType } from '../core/param.type'

/**
 * Request Data Transfer Object for Task routes
 *
 * Basically the object format used in the body of the request
 */

// type RunRequestDTO = {}
// type RunFromHereRequestDTO = {}
// type TestRestRequestDTO = {}
export type RunAllRequestDTO = {
    from: string
    meta: {
        appId: string
        flowId: string
    }
    params: Array<ParamType>
    tasks: Array<NodeType>
}
// type LogsRequestDTO = {}
// type AbortRequestDTO = {}
// type StatusRequestDTO = {}
// type CustomParamRequestDTO = {}

// type RunResponseDTO = {}
// type RunFromHereResponseDTO = {}
// type TestRestResponseDTO = {}
// type RunAllResponseDTO = {}
// type LogsResponseDTO = {}
// type AbortResponseDTO = {}
// type StatusResponseDTO = {}
// type CustomParamResponseDTO = {}
