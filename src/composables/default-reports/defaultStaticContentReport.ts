import type { ReportNodeType } from '@gaio/shared/types'
import type { StaticContentType } from '@gaio/shared/types/tasks/static-content.type'

export const defaultStaticContentReport = (base: ReportNodeType) => {
	const { project } = base
	console.log('project', project)
	return {
		reportType: 'staticContent',
		limit: base.limit ?? 100,
		tables: base.tables || [],
		content: base.content ?? '',
		project: {
			html: project?.html ?? '',
			libs: project?.libs ?? [],
			event: project?.event ?? '',
			style: project?.style ?? '',
			script: project?.script ?? ''
		},
		noSpeech: base.noSpeech ?? true,
		cardStyle: base.cardStyle ?? true,
		assetsCoverWidth: base.assetsCoverWidth ?? true
	} as StaticContentType
}
