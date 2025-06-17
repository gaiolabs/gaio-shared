import type { GenericType } from '../generic.type'
import type { CodeSnippetsEntity } from '../entities/codeSnippets.entity'
import type { FlowType } from './flow.type'
import type { SourceType } from './credential.type'
import type { ParamType } from './param.type'
import type { FormType } from './form.type'
import type { MetaType } from './meta.type'
import type { ApiKeyType, ApiType } from './api.type'
import type { MapType } from './map.type'

export type BackupExportType = {
    options: GenericType
    foundation: {
        flow: string[]
        params: string[]
        forms: string[]
        meta: string[]
        api: string[]
        maps: string[]
    }
}

export type ImportResult<T> = {
    replace: T[]
    create: T[]
}

export type AppImportMetadata = {
    cronFlow: GenericType[]
    cronMeta: GenericType[]
    codeSnippets: CodeSnippetsEntity[]
    flows: FlowType[]
    sources: SourceType[]
    params: ParamType[]
    forms: FormType[]
    meta: MetaType[]
    api: ApiType[]
    apiKey: ApiKeyType[]
    map: MapType[]
}

export type AppImportResult = {
    cronFlow: ImportResult<GenericType>
    cronMeta: ImportResult<GenericType>
    codeSnippets: ImportResult<CodeSnippetsEntity>
    flows: ImportResult<FlowType>
    params: ImportResult<ParamType>
    forms: ImportResult<FormType>
    meta: ImportResult<MetaType>
    api: ImportResult<ApiType>
    apiKey: ImportResult<ApiKeyType>
    map: ImportResult<MapType>
}
