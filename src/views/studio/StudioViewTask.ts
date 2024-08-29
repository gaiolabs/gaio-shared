import TaskAssociationRules from '@/views/studio/canvas/task-association-rules/TaskAssociationRules.vue'
import TaskCluster from '@/views/studio/canvas/task-cluster/TaskCluster.vue'
import TaskCreateTable from '@/views/studio/canvas/task-create-table/TaskCreateTable.vue'
import TaskCsvLocal from '@/views/studio/canvas/task-csv-local/TaskCsvLocal.vue'
import TaskCsvWeb from '@/views/studio/canvas/task-csv-web/TaskCsvWeb.vue'
import TaskDelete from '@/views/studio/canvas/task-delete/TaskDelete.vue'
import TaskExportCsv from '@/views/studio/canvas/task-export-csv/TaskExportCsv.vue'
import TaskForecast from '@/views/studio/canvas/task-forecast/TaskForecast.vue'
import TaskFormCard from '@/views/studio/canvas/task-form-card/TaskFormCard.vue'
import TaskGoogleSpreadsheet from '@/views/studio/canvas/task-google-spreadsheet/TaskGoogleSpreadsheet.vue'
import TaskInsertRow from '@/views/studio/canvas/task-insert-row/TaskInsertRow.vue'
import TaskInsertTable from '@/views/studio/canvas/task-insert-table/TaskInsertTable.vue'
import TaskParamToTable from '@/views/studio/canvas/task-param-to-table/TaskParamToTable.vue'
import TaskPca from '@/views/studio/canvas/task-pca/TaskPca.vue'
import TaskPivotTable from '@/views/studio/canvas/task-pivot-table/TaskPivotTable.vue'
import TaskQuickTable from '@/views/studio/canvas/task-quick-table/TaskQuickTable.vue'
import TaskReportPreview from '@/views/studio/canvas/task-report-preview/TaskReportPreview.vue'
import TaskRunFlow from '@/views/studio/canvas/task-run-flow/TaskRunFlow.vue'
import TaskSample from '@/views/studio/canvas/task-sample/TaskSample.vue'
import TaskTableToParam from '@/views/studio/canvas/task-table-to-param/TaskTableToParam.vue'
import TaskUnpivotTable from '@/views/studio/canvas/task-unpivot-table/TaskUnpivotTable.vue'
import TaskUpdate from '@/views/studio/canvas/task-update/TaskUpdate.vue'
import TaskUserMirror from '@/views/studio/canvas/task-user-mirror/TaskUserMirror.vue'
import TaskRest from './canvas/task-rest/TaskRest.vue'
import TaskStaticContent from './canvas/task-static-content/TaskStaticContent.vue'

export const taskView = {
	TaskReportPreview,
	TaskRest,
	TaskRunFlow,
	TaskPivotTable,
	TaskSample,
	TaskCluster,
	TaskCreateTable,
	TaskTableToParam,
	TaskParamToTable,
	TaskUserMirror,
	TaskCsvWeb,
	TaskGoogleSpreadsheet,
	TaskPca,
	TaskCsvLocal,
	TaskDelete,
	TaskAssociationRules,
	TaskUpdate,
	TaskInsertRow,
	TaskForecast,
	TaskExportCsv,
	TaskInsertTable,
	TaskQuickTable,
	TaskUnpivotTable,
	TaskFormCard,
	TaskStaticContent
}
