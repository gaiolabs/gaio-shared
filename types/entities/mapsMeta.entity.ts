/**
 * @description Refers to the "Maps Meta" schema from database
 */
export type MapsMetaEntity = {
	mapsMetaId: string
	appId: string
	title: string
	description: string
	zoom: number
	center: [number, number]
	type: string
	createdBy: string
	updatedBy: string
	createdAt: Date
	updatedAt: Date
}
