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
import { defaultReportChartBubble } from './default-reports/defaultReportChartBubble'
import { defaultReportChartCalendar } from './default-reports/defaultReportChartCalendar'
import { defaultReportChartDonut } from './default-reports/defaultReportChartDonut'
import { defaultReportChartFunnel } from './default-reports/defaultReportChartFunnel'
import { defaultReportChartGauge } from './default-reports/defaultReportChartGauge'
import { defaultReportChartRadar } from './default-reports/defaultReportChartRadar'
import { defaultReportChartScatter } from './default-reports/defaultReportChartScatter'
import { defaultReportChartSunburst } from './default-reports/defaultReportChartSunburst'
import { defaultWordCloudReport } from './default-reports/defaultWordCloudReport'

export default ({ type, reportType, base }: { type: string; reportType: ReportTypeKeys; base: ReportNodeType }) => {
	const sourceProperties = cloneDeep(base)

	if (type !== sourceProperties.type) {
		sourceProperties.id = null
	}

	sourceProperties.settings = sourceProperties.settings || {}

	let result
	switch (reportType) {
		case 'table':
			result = defaultTableReport(sourceProperties)
			break

		case 'bar':
			result = defaultReportChartBar(sourceProperties)
			break

		case 'column':
			result = defaultReportChartBar(sourceProperties)
			break

		case 'line':
			result = defaultReportChartLine(sourceProperties)
			break

		case 'area':
			result = defaultReportChartArea(sourceProperties)
			break

		case 'pie':
			result = defaultReportChartPie(sourceProperties)
			break

		case 'donut':
			result = defaultReportChartDonut(sourceProperties)
			break

		case 'scatter':
			result = defaultReportChartScatter(sourceProperties)
			break

		case 'bubble':
			result = defaultReportChartBubble(sourceProperties)
			break

		case 'radar':
			result = defaultReportChartRadar(sourceProperties)
			break

		case 'heatmap':
			result = defaultReportChartPie(sourceProperties) //TODO: Configurar o correto
			break

		case 'calendar':
			result = defaultReportChartCalendar(sourceProperties) //TODO: Configurar o correto
			break

		case 'funnel':
			result = defaultReportChartFunnel(sourceProperties)
			break

		case 'gauge':
			result = defaultReportChartGauge(sourceProperties)
			break

		case 'sunburst':
			result = defaultReportChartSunburst(sourceProperties) //TODO: Configurar o correto
			break

		case 'treemap':
			result = defaultReportChartTreemap(sourceProperties)
			break

		case 'download':
			result = defaultReportDownload(sourceProperties)
			break

		case 'staticContent':
			result = defaultStaticContentReport(sourceProperties)
			break

		case 'wordCloud':
			result = defaultWordCloudReport(sourceProperties)
			break

		default:
			result = {}
			break
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
		...result,
	}) as ReportNodeType
}
