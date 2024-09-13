
/**
 * @description Refers to the "Maps" schema from database
 */
export type MapsEntity = {
  mapsMetaId: string
  mapsId: string
  type: string
  properties: string
  geometryType: string
  geometryCoordinates: unknown // Array of array of arrays
	createdBy: string
	updatedBy: string
	createdAt: Date
	updatedAt: Date
}

