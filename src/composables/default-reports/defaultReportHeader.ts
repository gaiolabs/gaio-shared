import type { ReportTaskSettingsType } from '@gaio/shared/types'

export const defaultReportHeader = (settings: ReportTaskSettingsType) => {
	return {
		showHeader: settings.showHeader || false,
		title: settings.title || '',
		description: settings.description || '',
		titleAlign: settings.titleAlign || 'left',
		titleFontColor: settings.titleFontColor || '#000000',
		titleFontWeight: !!settings.titleBold,
		titleFontSize: Number(settings.titleFontSize) || 18,
	}
}
