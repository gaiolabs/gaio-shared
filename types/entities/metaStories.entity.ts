
/**
 * @description Refers to the "metaStories" schema from database
 */
export type MetaStoriesEntity = {
	metaStoryId: string
	label: string
	tableName: string
	content: string // '[]'
	options: string // '{}'
	userId: string
	powerType: string
	shared: string // 'n'
	hits: number // 1
}
