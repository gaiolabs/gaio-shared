export type GenericType = {
	[k: string]: any | GenericType
	type?: 'generic'
}
