
/**
 * @description Refers to the "metaStories" schema from database
 */
export type MetaStoriesEntity = {
	metaStoryId: string
	label: string
	content: string // '[]'
	options: string // '{}'
	userId: string
	shared: string // 'n'
	hits: number // 1
}
