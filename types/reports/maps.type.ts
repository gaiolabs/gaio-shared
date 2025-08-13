export type MapsType = Partial<{
    reportMap:{
        type: string
        id: string
        geoJSONProperty: string
        tableLinkColumnName: string
        tableValueColumnName: string
        modeType: 'distribuition' | 'range'
        paramName: string | null
    }
}> 


