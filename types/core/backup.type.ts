import type {GenericType} from "../generic.type";

export type BackupType = {
    options: GenericType,
    foundation: {
        flow: string[]
        params: string[]
        forms: string[]
        discovery: string[]
        api: string[]
        maps: string[]
    }
}