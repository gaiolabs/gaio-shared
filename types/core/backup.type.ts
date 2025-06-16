import type {GenericType} from "../generic.type";

export type BackupExportType = {
    options: GenericType,
    foundation: {
        flow: string[]
        params: string[]
        forms: string[]
        meta: string[]
        api: string[]
        maps: string[]
    }
}