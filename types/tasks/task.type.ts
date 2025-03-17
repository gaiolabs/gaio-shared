import type {
    SchemaType,
    BuilderTaskType,
    FlowTaskType,
    PivotTaskType,
    CommonTaskType,
    DeleteTaskType,
    TableToParamTaskType,
    TableType,
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
    FormCardType, ReportNodeType, SourceRawTaskType,
} from '../'
import {ReportTypeKeys} from './report.keys.type'


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
    type: 'base'
}> & CommonTaskType

export type TaskType =
    | SourceRawTaskType
    | QueryTaskType
    | ReportNodeType
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
    | TableType
    | base

export type CommonBuilderTaskType = Partial<base> & Partial<TaskType>

export type TaskBaseType = {
    automl: AutoMLTaskType
    scoring: ScoringTaskType
    reportPreview: ReportPreviewTaskType
    table: TableType
    sourceRaw: SourceRawTaskType
    builder: BuilderTaskType
    query: QueryTaskType
    reportNode: ReportNodeType
    flow: FlowTaskType
    pivot: PivotTaskType
    delete: DeleteTaskType
    quickTable: QuickTableTaskType
    insertRow: InsertRowTaskType
    updateRow: UpdateRowTaskType
    unpivot: UnpivotTaskType
    sample: SampleTaskType
    insertTable: InsertTableTaskType
    exportToFile: ExportToFileType
    user: UserTaskType
    createTable: CreateTableTaskType
    csvUrl: CsvUrlTaskType
    fileImport: FileImportTaskType
    forecast: ForecastTaskType
    python: PythonTaskType
    googleSpreadsheet: GoogleSpreadsheetTaskType
    localFile: LocalFileTaskType
    basket: AssociationRulesTaskType
    cluster: ClusterTaskType
    survivalAnalysis: SurvivalAnalysisTaskType
    mail: MailTaskType
    whatsapp: WhatsappTaskType
    rest: RestTaskType
    pca: PcaTaskType
    generic: GenericType
    externalOutput: ExternalOutputTaskType
    cloudFile: CloudFileType
    tableToParam: TableToParamTaskType
    paramToTable: ParamToTableTaskType
}