import type { BuilderTaskType, ParamType, TaskContextType, TaskType } from '@gaio/types'

import runnerAssociationRules from './runner-tasks/runner-association-rules'
import runnerCloudFile from './runner-tasks/runner-cloud-file'
import runnerAutoML from './runner-tasks/runner.automl'
import runnerBuilder from './runner-tasks/runner.builder'
import runnerCluster from './runner-tasks/runner.cluster'
import runnerCreateTable from './runner-tasks/runner.create-table'
import runnerCsvUrl from './runner-tasks/runner.csv-url'
import runnerDeleteRow from './runner-tasks/runner.delete-row'
import runnerExportToFile from './runner-tasks/runner.export-to-file'
import runnerFileImport from './runner-tasks/runner.file-import'
import runnerForecast from './runner-tasks/runner.forecast'
import runnerGoogleSpreadsheet from './runner-tasks/runner.google-spreadsheet'
import runnerInsertRow from './runner-tasks/runner.insert-row'
import runnerInsertTable from './runner-tasks/runner.insert-table'
import runnerLocalFile from './runner-tasks/runner.local-file'
import runnerMail from './runner-tasks/runner.mail'
import runnerParamToTable from './runner-tasks/runner.param-to-table'
import runnerPca from './runner-tasks/runner.pca'
import runnerPivotTable from './runner-tasks/runner.pivot-table'
import runnerPythonHub from './runner-tasks/runner.python-hub'
import runnerQuickTable from './runner-tasks/runner.quick-table'
import runnerRest from './runner-tasks/runner.rest'
import runnerSample from './runner-tasks/runner.sample'
import runnerScoring from './runner-tasks/runner.scoring'
import runnerSource from './runner-tasks/runner.source'
import runnerSurvivalAnalysis from './runner-tasks/runner.survival-analysis'
import runnerTableToParam from './runner-tasks/runner.table-to-param'
import runnerUnpivot from './runner-tasks/runner.unpivot'
import runnerUpdateRow from './runner-tasks/runner.update-row'
import runnerUser from './runner-tasks/runner.user'
import runnerWhatsapp from './runner-tasks/runner.whatsapp'

export default async (taskData: TaskType, params: ParamType[], taskContext: TaskContextType) => {
    switch (taskData.type) {
        case 'builder':
            return await triageTaskByBuilderType(taskData, params, taskContext)
        case 'pivot':
            return await runnerPivotTable(taskData)
        case 'unpivot':
            return await runnerUnpivot(taskData)
        case 'delete':
            return await runnerDeleteRow(taskData)
        case 'tableToParam':
            return await runnerTableToParam(taskData, params)
        case 'paramToTable':
            return await runnerParamToTable(taskData, params)
        case 'insertRow':
            return await runnerInsertRow(taskData, params)
        case 'updateRow':
            return await runnerUpdateRow(taskData, params)
        case 'sample':
            return await runnerSample(taskData)
        case 'quickTable':
            return await runnerQuickTable(taskData)
        case 'insert':
            return await runnerInsertTable(taskData)
        case 'pca':
            return await runnerPca(taskData)
        case 'cloudStorage':
            return await runnerCloudFile(taskData, params)
        case 'export':
            return await runnerExportToFile(taskData)
        case 'userMirror':
            return await runnerUser(taskData)
        case 'create':
            return await runnerCreateTable(taskData)
        case 'csvUrl':
            return await runnerCsvUrl(taskData, params)
        case 'fileImport':
            return await runnerFileImport(taskData, params, taskContext)
        case 'timeseries':
            return await runnerForecast(taskData)
        case 'basket':
            if (!taskData['newVersion']) {
                return await runnerAssociationRules(taskData)
            } else {
                return await runnerPythonHub(taskData, params, taskContext)
            }
        case 'cluster':
            return await runnerCluster(taskData)
        case 'googleSpreadsheet':
            return await runnerGoogleSpreadsheet(taskData)
        case 'coxph':
            return await runnerSurvivalAnalysis(taskData)
        case 'mail':
            return await runnerMail(taskData, taskContext)
        case 'whatsapp':
            return await runnerWhatsapp(taskData)
        case 'rest':
            return await runnerRest(taskData, params, taskContext)
        case 'automl':
            return await runnerAutoML(taskData, taskContext)
        case 'scoring':
            return await runnerScoring(taskData, taskContext)
        case 'localCsv':
            return await runnerLocalFile(taskData)
        default:
            return { status: 'no task' }
    }
}

const triageTaskByBuilderType = async (taskData: TaskType, params: ParamType[], taskContext: TaskContextType) => {
    if (taskData) {
        switch (taskData['sourceType']) {
            case 'bucket':
                return await runnerBuilder(taskData as BuilderTaskType, params)
            case 'source':
                return await runnerSource(taskData as BuilderTaskType, params, taskContext)
            default:
                return { status: 'No source' }
        }
    }
    return { status: 'No source' }
}
