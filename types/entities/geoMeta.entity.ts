
/**
 * @description Refers to the "Geo Meta" schema from database
 */
export type GeoMetaEntity = {
  geoMetaId: string
  appId: string
  geoTitle: string
  geoDescription: string
  zoom: number
  center: [number, number]
  type: string
	createdBy: string
	updatedBy: string
	createdAt: Date
	updatedAt: Date
}

