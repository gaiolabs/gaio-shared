export type UserOptionsType = Partial<{
    appList: string[]
    favoriteMetaTypes: {
        context: string[]
        view: string[]
        story: string[]
    }
    favoriteApps: string[]
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
    sessionStart: Date
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
