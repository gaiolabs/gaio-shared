import type {
    SchemaType,
    BuilderTaskType,
    FlowTaskType,
    PivotTaskType,
    CommonTaskType,
    DeleteTaskType,
    TableToParamTaskType,
    ParamToTableTaskType,
    QuickTableTaskType,
    FieldType,
    InsertRowTaskType,
    UpdateRowTaskType,
    UnpivotTaskType,
    SampleTaskType,
    InsertTableTaskType,
    CloudFileType,
    ExportToFileType,
    QueryTaskType,
    UserTaskType,
    CreateTableTaskType,
    ExternalOutputTaskType,
    CsvUrlTaskType,
    FileImportTaskType,
    ForecastTaskType,
    PythonHubTaskType,
    PythonTaskType,
    GoogleSpreadsheetTaskType,
    LocalFileTaskType,
    AssociationRulesTaskType,
    ClusterTaskType,
    SurvivalAnalysisTaskType,
    MailTaskType,
    WhatsappTaskType,
    RestTaskType,
    AutoMLTaskType,
    ScoringTaskType,
    GenericType,
    PcaTaskType,
    ReportPreviewTaskType,
    FormCardType,
    SourceRawTaskType
} from '../'
import { ReportTypeKeys } from './report.keys.type'

export type TaskTypeKeys =
    | 'sourceRaw'
    | 'query'
    | 'builder'
    | 'flow'
    | 'pivot'
    | 'tableToParam'
    | 'paramToTable'
    | 'delete'
    | 'quickTable'
    | 'insertRow'
    | 'updateRow'
    | 'unpivot'
    | 'sample'
    | 'insertTable'
    | 'export'
    | 'user'
    | 'createTable'
    | 'csvUrl'
    | 'fileImport'
    | 'forecast'
    | 'pythonHub'
    | 'python'
    | 'googleSpreadsheet'
    | 'localCsv'
    | 'associationRules'
    | 'cluster'
    | 'survivalAnalysis'
    | 'mail'
    | 'whatsapp'
    | 'rest'
    | 'automl'
    | 'scoring'
    | 'cloudStorage'
    | 'pca'
    | 'externalOutput'
    | 'reportPreview'
    | 'form'
    
type base = Partial<{
    dropTables: string[]
    withTotals: boolean
    insertMode: boolean
    schema: SchemaType
    columnName: string
    range: number[]
    bins: number
    countDistinct: string
    columns: FieldType[]
    sourceImportTask: string
    resultTableTruncate: string
    schemaInference: boolean
    newOracle: boolean
    runningFlowId: string
    flowId: string
    hasFilters: boolean
    untilRuleType: string
    untilParamName: string
    untilOperator: string
    untilParamValue: string
    reportType: ReportTypeKeys
    restType: string
    type: TaskTypeKeys 
}> &
    CommonTaskType

export type TaskType =
    | SourceRawTaskType
    | QueryTaskType
    | BuilderTaskType
    | FlowTaskType
    | PivotTaskType
    | TableToParamTaskType
    | ParamToTableTaskType
    | DeleteTaskType
    | QuickTableTaskType
    | InsertRowTaskType
    | UpdateRowTaskType
    | UnpivotTaskType
    | SampleTaskType
    | InsertTableTaskType
    | ExportToFileType
    | UserTaskType
    | CreateTableTaskType
    | CsvUrlTaskType
    | FileImportTaskType
    | ForecastTaskType
    | PythonHubTaskType
    | PythonTaskType
    | GoogleSpreadsheetTaskType
    | LocalFileTaskType
    | AssociationRulesTaskType
    | ClusterTaskType
    | SurvivalAnalysisTaskType
    | MailTaskType
    | WhatsappTaskType
    | RestTaskType
    | AutoMLTaskType
    | ScoringTaskType
    | CloudFileType
    | PcaTaskType
    | GenericType
    | ExternalOutputTaskType
    | ReportPreviewTaskType
    | FormCardType
    | base

export type CommonBuilderTaskType = base & TaskType
