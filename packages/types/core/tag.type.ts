import { CommonTableType } from './common-table.type'

export type TagType = Partial<{
    tagId: string
    userId: string
    refId: string
    type: string
    role: string
}> &
    CommonTableType

export type TagTypePermission = Partial<{
    appId: string
    sourceId: string
}> &
    TagType
