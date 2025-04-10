export const executables = [
    'builder',
    'pca',
    'insert',
    'pivot',
    'query',
    'fileImport',
    'exportToFile',
    'scoring',
    'paramToTable',
    'tableToParam',
    'rest',
    'whatsapp',
    'r',
    'mail',
    'flow',
    'automl',
    'userMirror',
    'castData',
    'update',
    'delete',
    'insertRow',
    'create',
    'forecast',
    'sourceRaw',
    'basket',
    'cluster',
    'coxph',
    'sample',
    'externalOutput',
    'csvUrl',
    'unpivot',
    'cloudStorage',
    'googleSpreadsheet',
    'scorecard',
    'nodeEdge',
    'nodeEdgeFilter',
    'localCsv',
    'python'
]

export const reports = ['form', 'report', 'maps', 'network', 'powerSearch', 'scorecard']

export const typesOfOpenTask = [
    'localCsv',
    'pca',
    'coxph',
    'sourceRaw',
    'forecast',
    'basket',
    'cluster',
    'castData',
    'automl',
    'insert',
    'exportToFile',
    'scoring',
    'api',
    'rest',
    'whatsapp',
    'paramToTable',
    'tableToParam',
    'pivot',
    'mail',
    'r',
    'userMirror',
    'flow',
    'update',
    'insertRow',
    'delete',
    'create',
    'sample',
    'externalOutput',
    'csvUrl',
    'googleSpreadsheet',
    'unpivot',
    'cloudStorage',
    'network',
    'powerSearch',
    'scorecard',
    'nodeEdge',
    'nodeEdgeFilter',
    'python'
]

export const taskList = (t: Function) => {
    return [
        {
            title: `${t('taskNames.builder')}`,
            type: 'builder',
            onlyBucket: true,
            icon: 'builder',
            cat: 'DATAPREP',
            catIcon: '',
            contextOrder: 1,
            showOnContextMenu: true,
            order: 1
        },
        {
            title: `${t('taskNames.query')}`,
            type: 'query',
            onlyBucket: false,
            icon: 'add',
            cat: 'DATAPREP',
            catIcon: '',
            contextOrder: 100,
            showOnContextMenu: true,
            order: 1
        },
        {
            title: `${t('taskNames.sourceRaw')}`,
            type: 'sourceRaw',
            onlyBucket: false,
            icon: 'table',
            cat: 'DATAPREP',
            catIcon: '',
            contextOrder: 100,
            showOnContextMenu: true,
            order: 1
        },
        {
            title: `${t('taskNames.report')}`,
            type: 'report',
            onlyBucket: true,
            onlyRepo: true,
            icon: 'g-report',
            cat: 'DELIVERY',
            catIcon: '',
            showOnContextMenu: true,
            contextOrder: 2,
            order: 3
        },
        // {
        //     title: `${t('taskNames.powerSearch')}`,
        //     type: 'powerSearch',
        //     onlyBucket: true,
        //     onlyRepo: false,
        //     icon: 'g-power-search',
        //     cat: 'DELIVERY',
        //     catIcon: '',
        //     showOnContextMenu: true,
        //     contextOrder: 3,
        //     order: 3
        // },
        // {
        //     title: `${t('taskNames.network')}`,
        //     type: 'network',
        //     onlyBucket: false,
        //     hidden: true,
        //     onlyRepo: false,
        //     icon: 'g-network',
        //     cat: 'DELIVERY',
        //     catIcon: '',
        //     showOnContextMenu: true,
        //     contextOrder: 10,
        //     order: 10
        // },
        {
            title: `${t('taskNames.insert')}`,
            type: 'insert',
            onlyBucket: true,
            icon: 'g-union-table',
            cat: 'DATAPREP',
            catIcon: '',
            showOnContextMenu: true,
            contextOrder: 100,
            order: 1
        },
        {
            title: `${t('taskNames.insertRow')}`,
            type: 'insertRow',
            onlyBucket: true,
            icon: 'g-row-insert',
            cat: 'DATAPREP',
            catIcon: '',
            showOnContextMenu: true,
            contextOrder: 100,
            order: 1
        },
        {
            title: `${t('taskNames.update')}`,
            type: 'update',
            onlyBucket: true,
            icon: 'g-table-update',
            cat: 'DATAPREP',
            catIcon: '',
            showOnContextMenu: true,
            contextOrder: 100,
            order: 1
        },
        {
            title: `${t('taskNames.delete')}`,
            type: 'delete',
            onlyBucket: true,
            icon: 'g-row-exclude',
            cat: 'DATAPREP',
            catIcon: '',
            showOnContextMenu: true,
            contextOrder: 100,
            order: 1
        },
        {
            title: `${t('taskNames.create')}`,
            type: 'create',
            onlyBucket: false,
            icon: 'g-create-table',
            cat: 'DATAPREP',
            catIcon: '',
            contextOrder: 100,
            showOnContextMenu: true,
            order: 1
        },
        {
            title: `${t('taskNames.quickTable')}`,
            type: 'quickTable',
            onlyBucket: false,
            icon: 'g-quick-table',
            cat: 'DATAPREP',
            catIcon: '',
            contextOrder: 100,
            showOnContextMenu: true,
            order: 1
        },
        {
            title: `${t('taskNames.quickUpload')}`,
            type: 'quickUpload',
            onlyBucket: false,
            icon: 'g-quick-table',
            cat: 'DATAPREP',
            catIcon: '',
            contextOrder: 100,
            showOnContextMenu: true,
            order: 1
        },
        {
            title: `${t('taskNames.sample')}`,
            type: 'sample',
            onlyBucket: true,
            icon: 'g-sample',
            cat: 'ANALYTICS',
            showOnContextMenu: true,
            catIcon: '',
            contextOrder: 100,
            order: 2
        },
        {
            title: `${t('taskNames.staticContent')}`,
            type: 'staticContent',
            onlyBucket: false,
            icon: 'g-content',
            hidden: false,
            cat: 'DELIVERY',
            catIcon: '',
            contextOrder: 100,
            showOnContextMenu: true,
            order: 3
        },
        {
            title: `${t('taskNames.form')}`,
            type: 'formCard',
            onlyBucket: false,
            icon: 'g-forms',
            cat: 'DELIVERY',
            catIcon: '',
            contextOrder: 100,
            showOnContextMenu: true,
            order: 3
        },
        {
            title: `${t('taskNames.externalOutput')}`,
            type: 'externalOutput',
            onlyBucket: true,
            icon: 'g-external-output',
            cat: 'DELIVERY',
            catIcon: '',
            showOnContextMenu: true,
            contextOrder: 100,
            order: 3
        },
        {
            title: `${t('taskNames.pivot')}`,
            type: 'pivot',
            onlyBucket: true,
            icon: 'g-pivot-table',
            cat: 'DATAPREP',
            catIcon: '',
            showOnContextMenu: true,
            contextOrder: 100,
            order: 1
        },
        {
            title: `${t('taskNames.unpivot')}`,
            type: 'unpivot',
            onlyBucket: true,
            icon: 'g-unpivot',
            hidden: false,
            cat: 'DATAPREP',
            catIcon: '',
            showOnContextMenu: true,
            contextOrder: 100,
            order: 1
        },
        // {
        //     title: `${t('taskNames.banner')}`,
        //     hidden: true,
        //     type: 'banner',
        //     onlyBucket: false,
        //     icon: 'g-banner',
        //     cat: 'DELIVERY',
        //     catIcon: '',
        //     contextOrder: 100,
        //     showOnContextMenu: true,
        //     order: 3
        // },
        {
            title: `${t('taskNames.export')}`,
            type: 'exportToFile',
            onlyBucket: true,
            icon: 'g-export-csv',
            cat: 'DELIVERY',
            showOnContextMenu: true,
            catIcon: '',
            contextOrder: 3,
            order: 3
        },
        {
            title: `${t('taskNames.automl')}`,
            type: 'automl',
            onlyBucket: true,
            icon: 'g-automl',
            showOnContextMenu: true,
            cat: 'ANALYTICS',
            catIcon: '',
            contextOrder: 3,
            order: 2
        },
        {
            title: `${t('taskNames.scoring')}`,
            type: 'scoring',
            onlyBucket: true,
            icon: 'g-scoring',
            cat: 'ANALYTICS',
            catIcon: '',
            showOnContextMenu: true,
            contextOrder: 100,
            order: 2
        },
        // {
        //     title: `${t('taskNames.coxph')}`,
        //     type: 'coxph',
        //     onlyBucket: true,
        //     icon: 'linechart-decline',
        //     hidden: true,
        //     cat: 'DELIVERY',
        //     showOnContextMenu: true,
        //     catIcon: '',
        //     contextOrder: 100,
        //     order: 3
        // },
        {
            title: `${t('taskNames.cluster')}`,
            type: 'cluster',
            onlyBucket: true,
            icon: 'g-cluster',
            showOnContextMenu: true,
            cat: 'ANALYTICS',
            catIcon: '',
            contextOrder: 100,
            order: 2
        },
        {
            title: `${t('taskNames.pca')}`,
            type: 'pca',
            onlyBucket: true,
            icon: 'g-pca',
            cat: 'ANALYTICS',
            catIcon: '',
            showOnContextMenu: true,
            contextOrder: 100,
            order: 2
        },
        {
            title: `${t('taskNames.basket')}`,
            type: 'basket',
            onlyBucket: true,
            icon: 'g-association-rules',
            cat: 'ANALYTICS',
            showOnContextMenu: true,
            catIcon: '',
            contextOrder: 100,
            order: 2
        },
        {
            title: `${t('taskNames.forecast')}`,
            type: 'forecast',
            onlyBucket: true,
            showOnContextMenu: true,
            icon: 'g-time-series',
            cat: 'ANALYTICS',
            catIcon: '',
            contextOrder: 100,
            order: 2
        },
        {
            title: `${t('taskNames.flow')}`,
            type: 'flow',
            onlyBucket: false,
            icon: 'g-run-flow',
            cat: 'DATAPREP',
            catIcon: '',
            contextOrder: 100,
            showOnContextMenu: true,
            order: 1
        },
        // {
        //     title: `${t('taskNames.maps')}`,
        //     hidden: true,
        //     type: 'maps',
        //     onlyBucket: true,
        //     icon: 'g-map',
        //     cat: 'DELIVERY',
        //     showOnContextMenu: true,
        //     catIcon: '',
        //     contextOrder: 100,
        //     order: 3
        // },
        // {
        //     title: `${t('taskNames.insights')}`,
        //     type: 'insights',
        //     onlyBucket: true,
        //     icon: 'g-insights',
        //     cat: 'DELIVERY',
        //     showOnContextMenu: true,
        //     catIcon: '',
        //     contextOrder: 100,
        //     order: 3
        // },
        // {
        //     title: `${t('taskNames.scorecard')}`,
        //     type: 'scorecard',
        //     hidden: true,
        //     onlyBucket: true,
        //     icon: 'g-scorecard',
        //     cat: 'DELIVERY',
        //     showOnContextMenu: true,
        //     catIcon: '',
        //     contextOrder: 100,
        //     order: 3
        // },
        {
            title: `${t('taskNames.api')}`,
            type: 'api',
            onlyBucket: true,
            icon: 'g-api',
            cat: 'DELIVERY',
            catIcon: '',
            showOnContextMenu: true,
            contextOrder: 100,
            order: 3
        },
        {
            title: `${t('taskNames.rest')}`,
            type: 'rest',
            onlyBucket: false,
            icon: 'g-rest',
            cat: 'DATAPREP',
            catIcon: '',
            showOnContextMenu: true,
            contextOrder: 100,
            order: 1
        },
        {
            title: `${t('taskNames.restSms')}`,
            type: 'restSms',
            onlyBucket: true,
            icon: 'g-sms',
            showOnContextMenu: true,
            cat: 'DELIVERY',
            catIcon: '',
            contextOrder: 100,
            order: 3,
            hidden: true,
        },
        {
            title: `${t('taskNames.whatsapp')}`,
            type: 'whatsapp',
            onlyBucket: true,
            icon: 'g-whatsapp',
            cat: 'DELIVERY',
            showOnContextMenu: true,
            catIcon: '',
            contextOrder: 100,
            order: 3,
            hidden: true,
        },
        // {
        //     title: `${t('taskNames.mail')}`,
        //     type: 'mail',
        //     hidden: true,
        //     onlyBucket: true,
        //     icon: 'g-mail',
        //     showOnContextMenu: true,
        //     cat: 'DELIVERY',
        //     catIcon: '',
        //     contextOrder: 100,
        //     order: 3
        // },
        {
            title: `${t('taskNames.paramToTable')}`,
            type: 'paramToTable',
            onlyBucket: false,
            icon: 'g-param-to-table',
            cat: 'DATAPREP',
            catIcon: '',
            contextOrder: 100,
            showOnContextMenu: true,
            order: 1
        },
        {
            title: `${t('taskNames.tableToParam')}`,
            type: 'tableToParam',
            onlyBucket: true,
            icon: 'g-table-to-param',
            cat: 'DATAPREP',
            showOnContextMenu: true,
            catIcon: '',
            contextOrder: 100,
            order: 1
        },
        {
            title: `${t('taskNames.userMirror')}`,
            type: 'userMirror',
            onlyBucket: false,
            icon: 'g-users',
            cat: 'DATAPREP',
            catIcon: '',
            contextOrder: 100,
            showOnContextMenu: true,
            order: 1
        },
        {
            title: `${t('taskNames.csvUrl')}`,
            type: 'csvUrl',
            onlyBucket: false,
            icon: 'g-csv-web',
            cat: 'DATAPREP',
            catIcon: '',
            contextOrder: 100,
            showOnContextMenu: true,
            order: 1
        },
        {
            title: `${t('taskNames.localCsv')}`,
            type: 'localCsv',
            onlyBucket: false,
            icon: 'g-csv-web',
            cat: 'DATAPREP',
            catIcon: '',
            contextOrder: 100,
            showOnContextMenu: true,
            order: 1
        },
        {
            title: `${t('taskNames.googleSpreadsheet')}`,
            type: 'googleSpreadsheet',
            onlyBucket: false,
            icon: 'g-google-sheets',
            cat: 'DATAPREP',
            catIcon: '',
            contextOrder: 100,
            showOnContextMenu: true,
            order: 1
        },
        {
            title: `${t('taskNames.python')}`,
            type: 'python',
            onlyBucket: false,
            icon: 'python',
            iconAttribute: 'icon',
            hidden: false,
            cat: 'ANALYTICS',
            catIcon: '',
            contextOrder: 100,
            showOnContextMenu: true,
            order: 2
        }
    ]
}