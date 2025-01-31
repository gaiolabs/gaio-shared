export type UserOptionsType = Partial<{
    appList: string[]
    favorApps: string[]
    favoriteMetaTypes: {
        context:string[]
        view:string[]
        stories:string[]
    }
    recentApps: string[]
    tableViewPageSize: number
    tableFrequencyPageSize: number
    appViewType: string
    userThemeMode: string
    studioDrawerFullscreen: boolean
    profilePic?: string
}>

export type UserType = Partial<{
    tags: string[]
    userId: string
    name: string
    status: 'active' | 'inactive'
    email: string
    created: Date
    updated: Date
    lang: string
    password?: string
    role: 'admin' | 'user' | 'dev'
    options: UserOptionsType
    sessionid: string
}>

export type UserAuthType = {
    token: string
    user: UserType
}
export type UserLoginType = {
    email: string
    password: string
}
