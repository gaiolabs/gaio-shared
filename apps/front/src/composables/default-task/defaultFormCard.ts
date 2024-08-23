import type { FormCardType, TaskType } from '@gaio/types'
import { definedOrDefault } from '@gaio/utils'

export const defaultFormCard = (base: FormCardType & TaskType) => {
    return {
        id: base.id || null,
        appId: base.appId,
        label: definedOrDefault(base.label, 'Form Card'),
        formId: base.formId || null,
        buttonSize: definedOrDefault(base.buttonSize, 'small'),
        buttonTheme: definedOrDefault(base.buttonTheme, '#182EAB'),
        buttonTitle: definedOrDefault(base.buttonTitle, 'Save'),
        formLoadType: definedOrDefault(base.formLoadType, 'button'),
        formFilterBehavior: definedOrDefault(base.formLoadType, false),
        position: base.position || { x: 63, y: 381.25 },
        type: 'report',
        reportType: 'form'
    }
}
