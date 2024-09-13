
/**
 * @description Refers to the "Geo Data" schema from database
 */
export type GeoDataEntity = {
  geoMetaId: string
  geoDataId: string
  type: string
  properties: string
  geometryType: string
  geometryCoordinates: unknown // Array of array of arrays
	createdBy: string
	updatedBy: string
	createdAt: Date
	updatedAt: Date
}

