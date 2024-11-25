import type { ParamType } from './param.type'
import type { FormType } from './form.type'
import { CommonTableType } from './common-table.type'
import { ComputedType } from './schema.type'

export type AppFolderOption = {
    label: string
    isLeaf: boolean
    children?: AppFolderOption[]
    [key: string]: any
}

export type AppOptionsType = Partial<{
    color: string
    group: string
    creator: string
    icon: string
    folderParam: AppFolderOption[]
    folderFlow: AppFolderOption[]
    studioFlowStart: string
    computed: ComputedType[]
    palette: Array<{
        backgroundColor: string
        colors: string[]
        labelTextFill: string
    }>
}>

export type AppType = Partial<{
    appId: string
    repoId: string
    appName: string
    appDescription: string
    params: Array<ParamType>
    forms: Array<FormType>
    appToken: string
    options: AppOptionsType
}> &
    CommonTableType
