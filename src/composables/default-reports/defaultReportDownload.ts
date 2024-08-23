import type { ReportNodeType } from '@gaio/types'
import { defaultSchema } from '@/composables/default-task/defaultSchema'

export const defaultReportDownload = (base: ReportNodeType) => {
    const { settings } = base

    return {
        id: base.id || null,
        reportType: 'download',
        schema: base.schema || defaultSchema,
        settings: {
            downloadSize: settings.downloadSize || 'small',
            downloadColor: settings.downloadColor || '',
            downloadRows: settings.downloadRows || 1000,
            downloadData: settings.downloadData || false
        }
    }
}
