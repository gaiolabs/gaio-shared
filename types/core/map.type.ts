export type MapType = Partial<{
    mapId: string
    appId: string
    options: {
        title: string
        description: string
        zoom: number
        center: [number, number]
    }
    shared: boolean
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
}>