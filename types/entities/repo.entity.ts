/**
 * @description Refers to the "repo" schema from database
 */
export type RepoEntity = {
	repoId: string
	repoName: string
	credentials: string // '{}'
	options: string // '{}'
	createdBy: string
	modifiedBy: string
	client: string // 'clickhouse'
	createdAt: Date
	updatedAt: Date
}
