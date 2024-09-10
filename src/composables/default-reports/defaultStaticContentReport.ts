import type { ReportNodeType } from '@gaio/shared/types'
import type { StaticContentType } from '@gaio/shared/types/tasks/static-content.type'

export const defaultStaticContentReport = (base: ReportNodeType) => {
	const { project } = base
	const defaultReport: StaticContentType = {
		reportType: 'staticContent',
		limit: base.limit ?? 100,
		tables: base.tables || [],
		content: base.content ?? '',
		project: {
			html: project?.html ?? '',
			libs: project?.libs ?? [],
			event: project?.event ?? '',
			style: project?.style ?? '',
			scriptCode: project?.scriptCode ?? ''
		},
		noSpeech: base.noSpeech ?? true,
		cardStyle: base.cardStyle ?? true,
		assetsCoverWidth: base.assetsCoverWidth ?? true
	}

	return defaultReport
}
