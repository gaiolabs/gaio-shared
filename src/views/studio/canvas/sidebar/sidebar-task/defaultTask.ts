const generateSchema = () => ({
	select: [],
	insert: [],
	update: [],
	delete: false,
	join: [],
	group: [],
	sort: [],
	filter: [{ operator: '=', list: [], andOr: 'and' }],
	having: [{ operator: '=', list: [], andOr: 'and' }],
	computed: [],
	limit: null,
	offset: null,
	limitBy: []
})

export const defaultTask = (data) => {
	return {
		schema: generateSchema(),
		builder: {
			id: null,
			appId: data.appId,
			bucketClient: null,
			client: data.client || 'clickhouse',
			databaseName: data.databaseName,
			insertMode: false,
			label: null,
			optimize: false,
			position: {
				x: 0,
				y: 0
			},
			rawImport: false,
			repoId: data.repoId,
			resultDatabase: null,
			resultTable: null,
			schema: generateSchema(),
			schemaName: null,
			sourceId: null,
			sourceType: data.sourceType || 'bucket',
			tableName: data.tableName,
			tableView: false,
			temporary: false,
			type: 'builder'
		}
	}
}
