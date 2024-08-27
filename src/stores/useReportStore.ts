import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { ReportNodeType } from '@gaio/shared/types/tasks/report.type'
import type { FieldType } from '@gaio/shared/types'
import useDataType from '@/composables/useDataType'
import { getId } from '@gaio/shared/utils'

export const useReportStore = defineStore('report', () => {
    const { dataTypeName } = useDataType()

    const currentField = ref<FieldType>()
    const current = ref<ReportNodeType>()
    const currentSetupActiveTab = ref<string>('source')
    const refreshPreviewKey = ref('any')

    const refreshPreview = () => (refreshPreviewKey.value = getId())

    const defineFieldOptions = (field: FieldType) => {
        const newField = {
            ...field,
            type: 'value'
        }

        const localType = dataTypeName(newField.dataType)
        if (['integer', 'decimal'].includes(localType)) {
            newField.type = 'sum'
            newField.alias = 'sum_' + newField.columnName
            newField.textAlign = 'right'
            if (localType === 'decimal' && !newField.formatType) {
                newField.separators = 'dotComma'
                newField.formatDecimalSize = 2
                newField.formatType = 'decimal'
            }
        }

        return newField
    }

    const showOnlyIf = (types: Array<string>) => types.includes(current.value.reportType)
    const hideOnlyIf = (types: Array<string>) => !types.includes(current.value.reportType)

    const isGrouped = computed(() => current.value?.settings?.type === 'grouped')

    const resetReport = () => {
        currentField.value = null
        current.value = null
        currentSetupActiveTab.value = 'source'
    }

    return {
        current,
        isGrouped,
        currentField,
        refreshPreviewKey,
        currentSetupActiveTab,
        showOnlyIf,
        hideOnlyIf,
        resetReport,
        refreshPreview,
        defineFieldOptions
    }
})
