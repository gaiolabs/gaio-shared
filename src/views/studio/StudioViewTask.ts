import TaskAssociationRules from '@/views/studio/tasks/task-association-rules/TaskAssociationRules.vue'
import TaskCluster from '@/views/studio/tasks/task-cluster/TaskCluster.vue'
import TaskCreateTable from '@/views/studio/tasks/task-create-table/TaskCreateTable.vue'
import TaskCsvLocal from '@/views/studio/tasks/task-csv-local/TaskCsvLocal.vue'
import TaskCsvWeb from '@/views/studio/tasks/task-csv-web/TaskCsvWeb.vue'
import TaskDelete from '@/views/studio/tasks/task-delete/TaskDelete.vue'
import TaskExportCsv from '@/views/studio/tasks/task-export-csv/TaskExportCsv.vue'
import TaskForecast from '@/views/studio/tasks/task-forecast/TaskForecast.vue'
import TaskFormCard from '@/views/studio/tasks/task-form-card/TaskFormCard.vue'
import TaskGoogleSpreadsheet from '@/views/studio/tasks/task-google-spreadsheet/TaskGoogleSpreadsheet.vue'
import TaskInsertRow from '@/views/studio/tasks/task-insert-row/TaskInsertRow.vue'
import TaskInsertTable from '@/views/studio/tasks/task-insert-table/TaskInsertTable.vue'
import TaskParamToTable from '@/views/studio/tasks/task-param-to-table/TaskParamToTable.vue'
import TaskPca from '@/views/studio/tasks/task-pca/TaskPca.vue'
import TaskPivotTable from '@/views/studio/tasks/task-pivot-table/TaskPivotTable.vue'
import TaskQuickTable from '@/views/studio/tasks/task-quick-table/TaskQuickTable.vue'
import TaskReportPreview from '@/views/studio/tasks/task-report-preview/TaskReportPreview.vue'
import TaskRunFlow from '@/views/studio/tasks/task-run-flow/TaskRunFlow.vue'
import TaskSample from '@/views/studio/tasks/task-sample/TaskSample.vue'
import TaskTableToParam from '@/views/studio/tasks/task-table-to-param/TaskTableToParam.vue'
import TaskUnpivotTable from '@/views/studio/tasks/task-unpivot-table/TaskUnpivotTable.vue'
import TaskUpdate from '@/views/studio/tasks/task-update/TaskUpdate.vue'
import TaskUserMirror from '@/views/studio/tasks/task-user-mirror/TaskUserMirror.vue'
import TaskRest from './tasks/task-rest/TaskRest.vue'
import TaskStaticContent from './tasks/task-static-content/TaskStaticContent.vue'

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
