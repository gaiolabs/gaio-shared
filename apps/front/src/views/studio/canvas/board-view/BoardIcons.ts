import type { TaskType } from '@gaio/types'

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
                image: '/images/flow/bg-mysql.png'
            }
        } else if (client === 'oracle') {
            return {
                image: '/images/flow/bg-oracle.png'
            }
        } else if (client === 'redshift') {
            return {
                image: '/images/flow/bg-redshift.png'
            }
        } else if (client === 'mssql') {
            return {
                image: '/images/flow/bg-mssql.png'
            }
        } else if (client === 'postgres') {
            return {
                image: '/images/flow/bg-postgres.png'
            }
        } else if (client === 'clickhouse') {
            return {
                image: '/images/flow/bg-clickhouse.png'
            }
        }
    } else if (
        shared &&
        ((type === 'table' && temporary && sourceType === 'bucket') ||
            (type === 'table' && sourceType === 'bucket' && `${tableName}`.startsWith('tmp_')))
    ) {
        return {
            image: '/images/flow/bg-table-temporary.png'
        }
    } else if (
        (type === 'table' && temporary && sourceType === 'bucket') ||
        (type === 'table' && sourceType === 'bucket' && `${tableName}`.startsWith('tmp_'))
    ) {
        return {
            image: '/images/flow/bg-table-shared.png'
        }
    } else if (type === 'table' && !temporary && sourceType === 'bucket') {
        return {
            image: '/images/flow/bg-table.png'
        }
    } else if (item.type === 'mysql') {
        return {
            image: '/images/flow/bg-mysql.png'
        }
    } else if (type === 'builder' && insertMode) {
        return {
            image: '/images/flow/bg-builder-insert.png'
        }
    } else if (type === 'staticContent') {
        return {
            image: '/images/flow/bg-report-static-content.png'
        }
    } else if (type === 'maps') {
        return {
            image: '/images/flow/bg-maps.png'
        }
    } else if (type === 'api') {
        return {
            image: '/images/flow/bg-api.png'
        }
    } else if (type === 'sms') {
        return {
            image: '/images/flow/bg-sms.png'
        }
    } else if (type === 'insights') {
        return {
            image: '/images/flow/bg-insights.png'
        }
    } else if (item.type === 'builder') {
        return {
            image: '/images/flow/bg-builder.png'
        }
    } else if (type === 'form') {
        return {
            image: '/images/flow/bg-report-form.png'
        }
    } else if (item.type === 'sql') {
        return {
            image: '/images/flow/bg-sql.png'
        }
    } else if (item.type === 'pivot') {
        return {
            image: '/images/flow/bg-pivot.png'
        }
    } else if (item.type === 'unpivot') {
        return {
            image: '/images/flow/bg-unpivot.png'
        }
    } else if (item.type === 'create') {
        return {
            image: '/images/flow/bg-create.png'
        }
    } else if (item.type === 'query') {
        return {
            image: '/images/flow/bg-query.png'
        }
    } else if (type === 'delete') {
        return {
            image: '/images/flow/bg-delete.png'
        }
    } else if (type === 'insertRow') {
        return {
            image: '/images/flow/bg-insert-row.png'
        }
    } else if (type === 'create') {
        return {
            image: '/images/flow/bg-create.png'
        }
    } else if (type === 'update') {
        return {
            image: '/images/flow/bg-update.png'
        }
    } else if (item.type === 'csvUrl') {
        return {
            image: '/images/flow/bg-csv-web.png'
        }
    } else if (type === 'localCsv') {
        return {
            image: '/images/flow/bg-local-csv.png'
        }
    } else if (type === 'cloudStorage') {
        return {
            image: '/images/flow/bg-cloudStorage.png'
        }
    } else if (type === 'googleSpreadsheet') {
        return {
            image: '/images/flow/bg-googleSpreadsheet.png'
        }
    } else if (type === 'fileImport') {
        return {
            image: '/images/flow/bg-fileImport.png'
        }
    } else if (type === 'userMirror') {
        return {
            image: '/images/flow/bg-user.png'
        }
    } else if (type === 'insert') {
        return {
            image: '/images/flow/bg-insert.png'
        }
    } else if (type === 'basket') {
        return {
            image: '/images/flow/bg-basket.png'
        }
    } else if (type === 'externalOutput') {
        return {
            image: '/images/flow/bg-external-output.png'
        }
    } else if (type === 'coxph') {
        return {
            image: '/images/flow/bg-coxph.png'
        }
    } else if (type === 'pca') {
        return {
            image: '/images/flow/bg-pca.png'
        }
    } else if (type === 'powerSearch') {
        return {
            image: '/images/flow/bg-powerSearch.png'
        }
    } else if (type === 'cluster') {
        return {
            image: '/images/flow/bg-cluster.png'
        }
    } else if (type === 'timeseries') {
        return {
            image: '/images/flow/bg-timeseries.png'
        }
    } else if (type === 'automl') {
        return {
            image: '/images/flow/bg-automl.png'
        }
    } else if (type === 'automlReport') {
        return {
            image: '/images/flow/bg-automl-report.png'
        }
    } else if (type === 'scorecard') {
        return {
            image: '/images/flow/bg-scorecard.png'
        }
    } else if (type === 'nodeEdgeFilter') {
        return {
            image: '/images/flow/bg-external-output.png'
        }
    } else if (type === 'nodeEdge') {
        return {
            image: '/images/flow/bg-scorecard.png'
        }
    } else if (type === 'sample') {
        return {
            image: '/images/flow/bg-sample.png'
        }
    } else if (type === 'reportPreview') {
        if (reportType === 'download') {
            return {
                image: '/images/flow/bg-export.png'
            }
        } else if (reportType === 'table') {
            return {
                image: '/images/flow/bg-explorer-table.png'
            }
        } else if (reportType === 'form') {
            return {
                image: '/images/flow/bg-report-form.png'
            }
        } else if (reportType === 'sunburst') {
            return {
                image: '/images/flow/bg-explorer-sunburst.png'
            }
        } else if (reportType === 'pie') {
            return {
                image: '/images/flow/bg-explorer-pie.png'
            }
        } else if (reportType === 'gauge') {
            return {
                image: '/images/flow/bg-explorer-gauge.png'
            }
        } else if (reportType === 'funnel') {
            return {
                image: '/images/flow/bg-explorer-funnel.png'
            }
        } else if (reportType === 'forecast') {
            return {
                image: '/images/flow/bg-explorer-forecast.png'
            }
        } else if (reportType === 'radar') {
            return {
                image: '/images/flow/bg-explorer-radar.png'
            }
        } else if (reportType === 'column') {
            return {
                image: '/images/flow/bg-explorer-column.png'
            }
        } else if (reportType === 'bullet') {
            return {
                image: '/images/flow/bg-explorer-bullet.png'
            }
        } else if (reportType === 'liquid') {
            return {
                image: '/images/flow/bg-explorer-liquid.png'
            }
        } else if (reportType === 'histogram') {
            return {
                image: '/images/flow/bg-explorer-histogram.png'
            }
        } else if (reportType === 'line') {
            return {
                image: '/images/flow/bg-explorer-line.png'
            }
        } else if (reportType === 'stacked') {
            return {
                image: '/images/flow/bg-explorer-stacked.png'
            }
        } else if (reportType === 'card') {
            return {
                image: '/images/flow/bg-explorer-card.png'
            }
        } else if (reportType === 'area') {
            return {
                image: '/images/flow/bg-explorer-area.png'
            }
        } else if (reportType === 'maps') {
            return {
                image: '/images/flow/bg-explorer-maps.png'
            }
        } else if (reportType === 'dual') {
            return {
                image: '/images/flow/bg-explorer-dual.png'
            }
        } else if (reportType === 'treemap') {
            return {
                image: '/images/flow/bg-explorer-treemap.png'
            }
        } else if (reportType === 'combo') {
            return {
                image: '/images/flow/bg-explorer-combo.png'
            }
        } else if (reportType === 'calendar') {
            return {
                image: '/images/flow/bg-explorer-calendar.png'
            }
        } else if (reportType === 'bubble') {
            return {
                image: '/images/flow/bg-explorer-bubble.png'
            }
        } else if (reportType === 'geojson') {
            return {
                image: '/images/flow/bg-explorer-geojson.png'
            }
        } else if (reportType === 'banner') {
            return {
                image: '/images/flow/bg-banner.png'
            }
        }
    } else if (type === 'report') {
        if (reportType === 'insights') {
            return {
                image: '/images/flow/bg-insights.png'
            }
        } else if (reportType === 'staticContent') {
            return {
                image: '/images/flow/bg-report-static-content.png'
            }
        }
        return {
            image: '/images/flow/bg-explorer.png'
        }
    } else if (type === 'mail') {
        return {
            image: '/images/flow/bg-mail.png'
        }
    } else if (type === 'export') {
        return {
            image: '/images/flow/bg-export.png'
        }
    } else if (type === 'tableToParam') {
        return {
            image: '/images/flow/bg-tableToParam.png'
        }
    } else if (type === 'paramToTable') {
        return {
            image: '/images/flow/bg-paramToTable.png'
        }
    } else if (type === 'whatsapp') {
        return {
            image: '/images/flow/bg-whatsapp.png'
        }
    } else if (type === 'flow') {
        return {
            image: '/images/flow/bg-flow.png'
        }
    } else if (type === 'scoring') {
        return {
            image: '/images/flow/bg-scoring.png'
        }
    } else if ((type === 'rest' && restType === 'sms') || type === 'restSms') {
        return {
            image: '/images/flow/bg-sms.png'
        }
    } else if (type === 'rest') {
        return {
            image: '/images/flow/bg-rest.png'
        }
    } else if (type === 'sourceRaw') {
        return {
            image: '/images/flow/bg-source-raw.png'
        }
    } else if (type === 'quickTable') {
        return {
            image: '/images/flow/bg-explorer-table.png'
        }
    } else if (type === 'python') {
        return {
            image: '/images/flow/bg-python.png'
        }
    }

    // end
    return {
        image: '/images/flow/bg-query.png'
    }
}
