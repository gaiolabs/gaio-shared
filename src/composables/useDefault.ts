import type { TaskType } from '@gaio/shared/types'
import { withoutNullProperties } from '@gaio/shared/utils'
import { cloneDeep } from 'lodash-es'

import { defaultAssociationRules } from '@/composables/default-task/defaultAssociationRules'
import { defaultBuilderTask } from '@/composables/default-task/defaultBuilderTask'
import { defaultCluster } from '@/composables/default-task/defaultCluster'
import { defaultCreateTable } from '@/composables/default-task/defaultCreateTable'
import { defaultCsvWeb } from '@/composables/default-task/defaultCsvWeb'
import { defaultDelete } from '@/composables/default-task/defaultDelete'
import { defaultExportCsv } from '@/composables/default-task/defaultExportCsv'
import { defaultForecast } from '@/composables/default-task/defaultForecast'
import { defaultFormCard } from '@/composables/default-task/defaultFormCard'
import { defaultGoogleSpreadsheet } from '@/composables/default-task/defaultGoogleSpreadsheet'
import { defaultInsertRow } from '@/composables/default-task/defaultInsertRow'
import { defaultInsertTable } from '@/composables/default-task/defaultInsertTable'
import { defaultMeta } from '@/composables/default-task/defaultMeta'
import { defaultParamToTable } from '@/composables/default-task/defaultParamToTable'
import { defaultPca } from '@/composables/default-task/defaultPca'
import { defaultPivot } from '@/composables/default-task/defaultPivot'
import { defaultQuickTable } from '@/composables/default-task/defaultQuickTable'
import { defaultReportPreview } from '@/composables/default-task/defaultReportPreview'
import { defaultRest } from '@/composables/default-task/defaultRest'
import { defaultRunFlow } from '@/composables/default-task/defaultRunFlow'
import { defaultSample } from '@/composables/default-task/defaultSample'
import { defaultSchema } from '@/composables/default-task/defaultSchema'
import { defaultTable } from '@/composables/default-task/defaultTable'
import { defaultTableToParam } from '@/composables/default-task/defaultTableToParam'
import { defaultUnpivot } from '@/composables/default-task/defaultUnpivot'
import { defaultUpdate } from '@/composables/default-task/defaultUpdate'
import { defaultUserMirror } from '@/composables/default-task/defaultUserMirror'

import { defaultCsvLocal } from './default-task/defaultCsvLocal'

export default ({ type, base }: { type: string; base: TaskType }) => {
    const sourceProperties = cloneDeep(base)

    if (type !== sourceProperties.type && !['form'].includes(type)) {
        sourceProperties.id = null
    }

    const prepare = {
        schema: () => defaultSchema,
        googleSpreadsheet: () => defaultGoogleSpreadsheet(sourceProperties),
        tableToParam: () => defaultTableToParam(sourceProperties),
        paramToTable: () => defaultParamToTable(sourceProperties),
        basket: () => defaultAssociationRules(sourceProperties),
        userMirror: () => defaultUserMirror(sourceProperties),
        insertRow: () => defaultInsertRow(sourceProperties),
        builder: () => defaultBuilderTask(sourceProperties),
        create: () => defaultCreateTable(sourceProperties),
        localCsv: () => defaultCsvLocal(sourceProperties),
        cluster: () => defaultCluster(sourceProperties),
        sample: () => defaultSample(sourceProperties),
        csvUrl: () => defaultCsvWeb(sourceProperties),
        delete: () => defaultDelete(sourceProperties),
        update: () => defaultUpdate(sourceProperties),
        flow: () => defaultRunFlow(sourceProperties),
        table: () => defaultTable(sourceProperties),
        pivot: () => defaultPivot(sourceProperties),
        unpivot: () => defaultUnpivot(sourceProperties),
        pca: () => defaultPca(sourceProperties),
        timeseries: () => defaultForecast(sourceProperties),
        export: () => defaultExportCsv(sourceProperties),
        insert: () => defaultInsertTable(sourceProperties),
        quickTable: () => defaultQuickTable(sourceProperties),
        reportPreview: () => defaultReportPreview(sourceProperties),
        form: () => defaultFormCard(sourceProperties),
        rest: () => defaultRest(sourceProperties),
        discovery: () => defaultMeta(sourceProperties)
    }

    return withoutNullProperties(prepare[type]())
}
