import type { TaskType } from '@gaio/shared/types'

type LocalSettingsType = {
	shared: boolean
	type: string
	client: string
	temporary: boolean
	sourceType: string
	tableName: string
	insertMode: boolean
	reportType: string
	restType: string
}

export const generateBase = (item: TaskType) => {
	const { shared, type, client, temporary, sourceType, tableName, insertMode, reportType, restType } =
		item as LocalSettingsType

	if (type === 'table' && sourceType === 'source') {
		if (client === 'mysql') {
			return {
				image: 'bg-mysql.png',
			}
		} else if (client === 'oracle') {
			return {
				image: 'bg-oracle.png',
			}
		} else if (client === 'redshift') {
			return {
				image: 'bg-redshift.png',
			}
		} else if (client === 'mssql') {
			return {
				image: 'bg-mssql.png',
			}
		} else if (client === 'postgres') {
			return {
				image: 'bg-postgres.png',
			}
		} else if (client === 'clickhouse') {
			return {
				image: 'bg-clickhouse.png',
			}
		}
	} else if (
		shared &&
		((type === 'table' && temporary && sourceType === 'bucket') ||
			(type === 'table' && sourceType === 'bucket' && `${tableName}`.startsWith('tmp_')))
	) {
		return {
			image: 'bg-table-temporary.png',
		}
	} else if (
		(type === 'table' && temporary && sourceType === 'bucket') ||
		(type === 'table' && sourceType === 'bucket' && `${tableName}`.startsWith('tmp_'))
	) {
		return {
			image: 'bg-table-shared.png',
		}
	} else if (type === 'table' && !temporary && sourceType === 'bucket') {
		return {
			image: 'bg-table.png',
		}
	} else if (item.type === 'mysql') {
		return {
			image: 'bg-mysql.png',
		}
	} else if (type === 'builder' && insertMode) {
		return {
			image: 'bg-builder-insert.png',
		}
	} else if (type === 'staticContent') {
		return {
			image: 'bg-report-static-content.png',
		}
	} else if (type === 'maps') {
		return {
			image: 'bg-maps.png',
		}
	} else if (type === 'api') {
		return {
			image: 'bg-api.png',
		}
	} else if (type === 'sms') {
		return {
			image: 'bg-sms.png',
		}
	} else if (type === 'insights') {
		return {
			image: 'bg-insights.png',
		}
	} else if (item.type === 'builder') {
		return {
			image: 'bg-builder.png',
		}
	} else if (type === 'form') {
		return {
			image: 'bg-report-form.png',
		}
	} else if (item.type === 'sql') {
		return {
			image: 'bg-sql.png',
		}
	} else if (item.type === 'pivot') {
		return {
			image: 'bg-pivot.png',
		}
	} else if (item.type === 'unpivot') {
		return {
			image: 'bg-unpivot.png',
		}
	} else if (item.type === 'create') {
		return {
			image: 'bg-create.png',
		}
	} else if (item.type === 'query') {
		return {
			image: 'bg-query.png',
		}
	} else if (type === 'delete') {
		return {
			image: 'bg-delete.png',
		}
	} else if (type === 'insertRow') {
		return {
			image: 'bg-insert-row.png',
		}
	} else if (type === 'create') {
		return {
			image: 'bg-create.png',
		}
	} else if (type === 'update') {
		return {
			image: 'bg-update.png',
		}
	} else if (item.type === 'csvUrl') {
		return {
			image: 'bg-csv-web.png',
		}
	} else if (type === 'localCsv') {
		return {
			image: 'bg-local-csv.png',
		}
	} else if (type === 'cloudStorage') {
		return {
			image: 'bg-cloudStorage.png',
		}
	} else if (type === 'googleSpreadsheet') {
		return {
			image: 'bg-googleSpreadsheet.png',
		}
	} else if (type === 'fileImport') {
		return {
			image: 'bg-fileImport.png',
		}
	} else if (type === 'userMirror') {
		return {
			image: 'bg-user.png',
		}
	} else if (type === 'insert') {
		return {
			image: 'bg-insert.png',
		}
	} else if (type === 'basket') {
		return {
			image: 'bg-basket.png',
		}
	} else if (type === 'externalOutput') {
		return {
			image: 'bg-external-output.png',
		}
	} else if (type === 'coxph') {
		return {
			image: 'bg-coxph.png',
		}
	} else if (type === 'pca') {
		return {
			image: 'bg-pca.png',
		}
	} else if (type === 'powerSearch') {
		return {
			image: 'bg-powerSearch.png',
		}
	} else if (type === 'cluster') {
		return {
			image: 'bg-cluster.png',
		}
	} else if (type === 'timeseries') {
		return {
			image: 'bg-timeseries.png',
		}
	} else if (type === 'automl') {
		return {
			image: 'bg-automl.png',
		}
	} else if (type === 'automlReport') {
		return {
			image: 'bg-automl-report.png',
		}
	} else if (type === 'scorecard') {
		return {
			image: 'bg-scorecard.png',
		}
	} else if (type === 'nodeEdgeFilter') {
		return {
			image: 'bg-external-output.png',
		}
	} else if (type === 'nodeEdge') {
		return {
			image: 'bg-scorecard.png',
		}
	} else if (type === 'sample') {
		return {
			image: 'bg-sample.png',
		}
	} else if (type === 'reportPreview') {
		if (reportType === 'download') {
			return {
				image: 'bg-export.png',
			}
		} else if (reportType === 'table') {
			return {
				image: 'bg-explorer-table.png',
			}
		} else if (reportType === 'form') {
			return {
				image: 'bg-report-form.png',
			}
		} else if (reportType === 'sunburst') {
			return {
				image: 'bg-explorer-sunburst.png',
			}
		} else if (reportType === 'pie') {
			return {
				image: 'bg-explorer-pie.png',
			}
		} else if (reportType === 'gauge') {
			return {
				image: 'bg-explorer-gauge.png',
			}
		} else if (reportType === 'funnel') {
			return {
				image: 'bg-explorer-funnel.png',
			}
		} else if (reportType === 'forecast') {
			return {
				image: 'bg-explorer-forecast.png',
			}
		} else if (reportType === 'radar') {
			return {
				image: 'bg-explorer-radar.png',
			}
		} else if (reportType === 'column') {
			return {
				image: 'bg-explorer-column.png',
			}
		} else if (reportType === 'bullet') {
			return {
				image: 'bg-explorer-bullet.png',
			}
		} else if (reportType === 'liquid') {
			return {
				image: 'bg-explorer-liquid.png',
			}
		} else if (reportType === 'histogram') {
			return {
				image: 'bg-explorer-histogram.png',
			}
		} else if (reportType === 'line') {
			return {
				image: 'bg-explorer-line.png',
			}
		} else if (reportType === 'stacked') {
			return {
				image: 'bg-explorer-stacked.png',
			}
		} else if (reportType === 'card') {
			return {
				image: 'bg-explorer-card.png',
			}
		} else if (reportType === 'area') {
			return {
				image: 'bg-explorer-area.png',
			}
		} else if (reportType === 'maps') {
			return {
				image: 'bg-explorer-maps.png',
			}
		} else if (reportType === 'dual') {
			return {
				image: 'bg-explorer-dual.png',
			}
		} else if (reportType === 'treemap') {
			return {
				image: 'bg-explorer-treemap.png',
			}
		} else if (reportType === 'combo') {
			return {
				image: 'bg-explorer-combo.png',
			}
		} else if (reportType === 'calendar') {
			return {
				image: 'bg-explorer-calendar.png',
			}
		} else if (reportType === 'bubble') {
			return {
				image: 'bg-explorer-bubble.png',
			}
		} else if (reportType === 'geojson') {
			return {
				image: 'bg-explorer-geojson.png',
			}
		} else if (reportType === 'banner') {
			return {
				image: 'bg-banner.png',
			}
		}
	} else if (type === 'report') {
		if (reportType === 'insights') {
			return {
				image: 'bg-insights.png',
			}
		} else if (reportType === 'staticContent') {
			return {
				image: 'bg-report-static-content.png',
			}
		}
		return {
			image: 'bg-explorer.png',
		}
	} else if (type === 'mail') {
		return {
			image: 'bg-mail.png',
		}
	} else if (type === 'export') {
		return {
			image: 'bg-export.png',
		}
	} else if (type === 'tableToParam') {
		return {
			image: 'bg-tableToParam.png',
		}
	} else if (type === 'paramToTable') {
		return {
			image: 'bg-paramToTable.png',
		}
	} else if (type === 'whatsapp') {
		return {
			image: 'bg-whatsapp.png',
		}
	} else if (type === 'flow') {
		return {
			image: 'bg-flow.png',
		}
	} else if (type === 'scoring') {
		return {
			image: 'bg-scoring.png',
		}
	} else if ((type === 'rest' && restType === 'sms') || type === 'restSms') {
		return {
			image: 'bg-sms.png',
		}
	} else if (type === 'rest') {
		return {
			image: 'bg-rest.png',
		}
	} else if (type === 'sourceRaw') {
		return {
			image: 'bg-source-raw.png',
		}
	} else if (type === 'quickTable') {
		return {
			image: 'bg-explorer-table.png',
		}
	} else if (type === 'python') {
		return {
			image: 'bg-python.png',
		}
	}

	// end
	return {
		image: 'bg-query.png',
	}
}
