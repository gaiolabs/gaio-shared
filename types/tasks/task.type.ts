import type {
    AiAgentTaskType,
    AssociationRulesTaskType,
    AutoMLTaskType,
    BuilderTaskType,
    CloudFileType,
    ClusterTaskType,
    CommonTaskType,
    CreateTableTaskType,
    CrosstableTaskType,
    CsvUrlTaskType,
    DefineParamTaskType,
    DeleteTaskType,
    DiagramQueryTaskType,
    ExportToFileType,
    ExternalOutputTaskType,
    FieldType,
    FileImportTaskType,
    FlowTaskType,
    ForecastTaskType,
    FormCardType,
    GenericType,
    GoogleSpreadsheetTaskType,
    InsertRowTaskType,
    InsertTableTaskType,
    LocalFileTaskType,
    MailTaskType,
    OcrParserTaskType,
    ParamToTableTaskType,
    PcaTaskType,
    PivotTaskType,
    PythonHubTaskType,
    PythonTaskType,
    QueryTaskType,
    QuickTableTaskType,
    QuickUploadTaskType,
    ReportNodeType,
    ReportPreviewTaskType,
    ReportTypeKeys,
    RestTaskType,
    SampleTaskType,
    SchemaType,
    ScoringTaskType,
    SourceRawTaskType,
    SurvivalAnalysisTaskType,
    TableToParamTaskType,
    TableType,
    UnpivotTaskType,
    UpdateRowTaskType,
    UserTaskType,
    WhatsappTaskType
} from '../'
import type { FileIngestTaskType } from './file-ingest.task.type'

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
}> &
    CommonTaskType

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
    | QuickUploadTaskType
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
    | DefineParamTaskType
    | CrosstableTaskType
    | base
    | FileIngestTaskType
    | AiAgentTaskType
    | OcrParserTaskType
    | DiagramQueryTaskType

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
    quickUpload: QuickUploadTaskType
    insertRow: InsertRowTaskType
    update: UpdateRowTaskType
    unpivot: UnpivotTaskType
    sample: SampleTaskType
    insert: InsertTableTaskType
    exportToFile: ExportToFileType
    userMirror: UserTaskType
    create: CreateTableTaskType
    csvUrl: CsvUrlTaskType
    fileImport: FileImportTaskType
    forecast: ForecastTaskType
    python: PythonTaskType
    googleSpreadsheet: GoogleSpreadsheetTaskType
    localCsv: LocalFileTaskType
    basket: AssociationRulesTaskType
    cluster: ClusterTaskType
    survivalAnalysis: SurvivalAnalysisTaskType
    mail: MailTaskType
    whatsapp: WhatsappTaskType
    rest: RestTaskType
    pca: PcaTaskType
    generic: GenericType
    externalOutput: ExternalOutputTaskType
    defineParam: DefineParamTaskType
    cloudFile: CloudFileType
    tableToParam: TableToParamTaskType
    paramToTable: ParamToTableTaskType
    crosstable: CrosstableTaskType
    fileIngest: FileIngestTaskType
    aiAgent: AiAgentTaskType
    diagramQuery: DiagramQueryTaskType
    ocrParser: OcrParserTaskType
}
