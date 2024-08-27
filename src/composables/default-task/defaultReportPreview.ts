import type { ReportPreviewTaskType } from '@gaio/shared/types'

export const defaultReportPreview = (base: ReportPreviewTaskType) => {
    return {
        id: base.id,
        position: base.position || { x: 65, y: 65 },
        reportId: base.reportId || base.id,
        reportType: base.reportType,
        type: 'reportPreview'
    }
}
