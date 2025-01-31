import type { MetaType } from '../core/meta.type'
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
    schemaInference: string
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
    | QueryTaskType
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
    | ExternalOutputTaskType
    | ReportPreviewTaskType
    | FormCardType
    | base

export type CommonBuilderTaskType = base & TaskType
