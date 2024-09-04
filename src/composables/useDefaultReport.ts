import { defaultReportChartArea } from '@/composables/default-reports/defaultReportChartArea'
import { defaultReportChartBar } from '@/composables/default-reports/defaultReportChartBar'
import { defaultReportChartLine } from '@/composables/default-reports/defaultReportChartLine'
import { defaultReportChartPie } from '@/composables/default-reports/defaultReportChartPie'
import { defaultReportChartTreemap } from '@/composables/default-reports/defaultReportChartTreemap'
import { defaultReportDownload } from '@/composables/default-reports/defaultReportDownload'
import { defaultStaticContentReport } from '@/composables/default-reports/defaultStaticContentReport'
import { defaultTableReport } from '@/composables/default-reports/defaultTableReport'
import type { ReportNodeType, ReportTypeKeys } from '@gaio/shared/types'
import { getBucketNameFromAppId, withoutNullProperties } from '@gaio/shared/utils'
import { cloneDeep } from 'lodash-es'

export default ({ type, reportType, base }: { type: string; reportType: ReportTypeKeys; base: ReportNodeType }) => {
	const sourceProperties = cloneDeep(base)

	if (type !== sourceProperties.type) {
		sourceProperties.id = null
	}

	sourceProperties.settings = sourceProperties.settings || {}

	const prepare = {
		table: () => defaultTableReport(sourceProperties),
		bar: () => defaultReportChartBar(sourceProperties),
		column: () => defaultReportChartBar(sourceProperties),
		line: () => defaultReportChartLine(sourceProperties),
		download: () => defaultReportDownload(sourceProperties),
		treemap: () => defaultReportChartTreemap(sourceProperties),
		pie: () => defaultReportChartPie(sourceProperties),
		area: () => defaultReportChartArea(sourceProperties),
		staticContent: () => defaultStaticContentReport(sourceProperties)
	}

	return withoutNullProperties({
		id: base.id || null,
		type: 'report',
		appId: base.appId,
		label: base.label,
		client: 'clickhouse',
		repoId: base.repoId,
		created: !!base.created,
		position: base.position || { x: 63, y: 381.25 },
		sourceType: 'bucket',
		databaseName: getBucketNameFromAppId(base.appId),
		tableName: base.tableName,
		layout: base.layout || {},
		...prepare[reportType]()
	}) as ReportNodeType
}
