
/**
 * @description Refers to the "Geo Meta" schema from database
 */
export type GeoMetaEntity = {
  geoMetaId: string
  geoTitle: string
  geoDescription: string
  zoom: number
  center: [number, number]
	createdBy: string
	updatedBy: string
	createdAt: Date
	updatedAt: Date
}

