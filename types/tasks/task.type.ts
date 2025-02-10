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
} from '../'
import { ReportTypeKeys } from './report.keys.type'


// Make the base type use the discriminator
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
    type: 'base' | 'pivot' | 'mail' | 'query' | 'builder' | 'flow' | 'tableToParam' | 'paramToTable' | 'delete' | 'quickTable' | 'insertRow' | 'updateRow' | 'unpivot' | 'sample' | 'insert' | 'exportToFile' | 'user' | 'create' | 'csvUrl' | 'fileImport' | 'forecast' | 'pythonHub' | 'python' | 'googleSpreadsheet' | 'localCsv' | 'associationRules' | 'cluster' | 'survivalAnalysis' | 'whatsapp' | 'rest' | 'autoML' | 'scoring' | 'cloudFile' | 'pca' | 'generic' | 'externalOutput' | 'reportPreview' | 'formCard'
}> & CommonTaskType

export type TaskType =
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
    // | GenericType
    // | ExternalOutputTaskType
    | ReportPreviewTaskType
    | FormCardType
    | base

export type CommonBuilderTaskType = base & TaskType
