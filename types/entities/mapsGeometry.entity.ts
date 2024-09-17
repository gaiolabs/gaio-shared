
/**
 * @description Refers to the "Maps Geometry" schema from database
 */
export type MapsGeometryEntity = {
  mapsMetaId: string
  mapsGeometryId: string
  type: string
  properties: string
  geometryType: string
  geometryCoordinates: unknown // Array of array of arrays
	createdBy: string
	updatedBy: string
	createdAt: Date
	updatedAt: Date
}

