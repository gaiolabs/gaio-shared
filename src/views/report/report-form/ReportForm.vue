<template>
    <div
        v-if="localForm && localTask && type !== 'any'"
        :key="localForm?.formId"
        class="report-form w-full"
    >
        <!-- BUTTON -->
        <template v-if="type === 'button' && ['preview', 'dash'].includes(from) && formFrom !== 'table'">
            <n-button
                block
                :size="buttonSize"
                :color="buttonTheme"
                class="text-white"
                @click="loadOrDialogModal()"
            >
                {{ localTask.buttonTitle }}
            </n-button>
        </template>
        <!-- CARD -->
        <template v-else-if="type === 'card'">
            <div
                style="height: 100%"
                class="overflow-hidden rounded border bg-paper-100 dark:bg-carbon-100"
                :class="localTask.removeCardStyle ? 'no-card' : 'card-style'"
            >
                <div
                    v-if="!localTask.removeCardStyle"
                    class="card-header border-b bg-paper-200 p-1 dark:bg-carbon-200"
                >
                    {{ localTask.label }}
                    <n-tooltip
                        v-if="hasHidden"
                        :persistent="false"
                        :show-after="1500"
                        :content="$t('lang.PARAMS_SHOW_HIDDEN')"
                    >
                        <template #trigger>
                            <g-icon
                                style="margin-top: 2px"
                                name="g-eye el-cursor el-right"
                                @click="showHidden = !showHidden"
                            />
                        </template>
                    </n-tooltip>
                </div>
                <div class="card-body">
                    <div class="card-body-inner">
                        <report-form-grid
                            :key="fieldKey"
                            :edit="false"
                            :form-data="localForm"
                            :show-hidden="showHidden"
                            :is-filter="localTask.formFilterBehavior"
                            @run="run()"
                        />
                        <div
                            v-if="!localTask.formFilterBehavior"
                            class="m-2 flex justify-end"
                        >
                            <n-popover
                                v-if="localForm?.formConfirm"
                                :visible="localPopoverConfirm"
                                :width="200"
                            >
                                <div>
                                    <p>{{ localForm.formConfirmDescription }}</p>
                                    <div class="flex items-center justify-between">
                                        <n-button @click="localPopoverConfirm = false">
                                            {{ $t('lang.CLOSE') }}
                                        </n-button>
                                        <n-button
                                            :disabled="invalid"
                                            type="primary"
                                            @click="justUpdateParams()"
                                        >
                                            {{ $t('lang.CONFIRM') }}
                                        </n-button>
                                    </div>
                                </div>
                                <template #trigger>
                                    <span>
                                        <n-button
                                            :disabled="invalid"
                                            :size="buttonSize"
                                            :color="buttonTheme"
                                            style="color: white"
                                            @click="localPopoverConfirm = true"
                                        >
                                            {{ $t('confirm') }}
                                        </n-button>
                                    </span>
                                </template>
                            </n-popover>
                            <n-button
                                v-else
                                :disabled="invalid"
                                :size="buttonSize"
                                :color="buttonTheme"
                                style="color: white"
                                @click="updateParams()"
                            >
                                {{ formButtonTitle }}
                            </n-button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <!-- DIALOG -->
        <template v-if="showModal">
            <g-dialog @close="close()">
                <template #title>{{ localTask.label || localForm.formName || $t('form') }}</template>
                <template #content>
                    <report-form-grid
                        :key="fieldKey"
                        :edit="false"
                        :form-data="localForm"
                        :show-hidden="showHidden"
                        @run="run()"
                        @change="localForm = $event"
                    />

                    <div class="flex w-full items-center justify-end">
                        <div>
                            <n-tooltip
                                v-if="hasHidden"
                                :persistent="false"
                                :show-after="1500"
                                :content="$t('lang.PARAMS_SHOW_HIDDEN')"
                            >
                                <template #trigger>
                                    <g-icon
                                        style="margin: 6px 0 0 10px"
                                        name="g-eye el-cursor el-left"
                                        @click="showHidden = !showHidden"
                                    />
                                </template>
                            </n-tooltip>
                        </div>
                        <div class="flex justify-end">
                            <n-popover
                                v-if="localForm?.formConfirm"
                                :visible="localPopoverConfirm"
                                :width="200"
                            >
                                <div>
                                    <p>{{ localForm.formConfirmDescription }}</p>
                                    <span class="flex items-center justify-between">
                                        <n-button @click="localPopoverConfirm = false">{{ $t('lang.CLOSE') }}</n-button>
                                        <n-button
                                            :disabled="invalid"
                                            style="margin-left: 5px"
                                            type="primary"
                                            @click="justUpdateParams()"
                                        >
                                            {{ $t('lang.CONFIRM') }}
                                        </n-button>
                                    </span>
                                </div>

                                <template #trigger>
                                    <n-button
                                        :disabled="invalid"
                                        style="margin-left: 5px; color: white"
                                        :size="buttonSize"
                                        :color="buttonTheme"
                                        @click="localPopoverConfirm = true"
                                    >
                                        {{ $t('lang.CONFIRM') }}
                                    </n-button>
                                </template>
                            </n-popover>
                            <n-button
                                v-else
                                size="small"
                                :disabled="invalid"
                                style="margin-left: 5px; color: white"
                                :color="buttonTheme"
                                @click="updateParams()"
                            >
                                {{ formButtonTitle }}
                            </n-button>
                        </div>
                    </div>
                </template>
            </g-dialog>
        </template>
    </div>
</template>

<script setup lang="ts">
import type { FormCardType, FormFieldType, FormType, GenericType, GenericValueType, ParamType } from '@gaio/types'
import { getId } from '@gaio/utils'
import { cloneDeep, isArray, isNumber } from 'lodash-es'
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import useApi from '@/composables/useApi'
import { useAppStore } from '@/stores'
import ReportFormGrid from '@/views/report/report-form/ReportFormGrid.vue'

const emit = defineEmits(['change', 'close'])
const props = defineProps<{
    task: FormCardType
    height: string
    formFrom?: string
    sourceParams?: GenericType
}>()

const { t } = useI18n()
const localForm = ref<FormType>({})
const localTask = ref<FormCardType>()
const fieldKey = ref('key')
const showModal = ref(false)
const showHidden = ref(false)
const localPopoverConfirm = ref(false)
const type = ref('any')
const loading = ref(false)
const router = useRouter()

const justUpdateParams = () => {
    localPopoverConfirm.value = false
    updateParams()
}

const buttonSize = computed(() => {
    return localTask.value.buttonSize || 'small'
})

const buttonTheme = computed(() => {
    return localTask.value.buttonTheme || '#182EAB'
})

const invalid = computed(() => {
    const hasValue = (val) => {
        if (isArray(val)) {
            if (val && val.length > 0) {
                return true
            }
        } else {
            return !!val
        }
        return false
    }

    return (
        localForm.value &&
        localForm.value.formElements.reduce((acc, element) => {
            return (
                acc ||
                Object.values(element.cols).reduce((acc, fields: FormFieldType[]) => {
                    return (
                        acc ||
                        fields.reduce((acc, field: FormFieldType) => {
                            return acc || (field.required && !hasValue(field.value))
                        }, false)
                    )
                }, false)
            )
        }, false)
    )
})

const paramsResetKey = computed(() => {
    return useAppStore().refreshKey
})

const hasHidden = computed(() => {
    return (
        localForm.value &&
        localForm.value.formElements &&
        localForm.value.formElements.some((element) => {
            return Object.values(element.cols).some((fields: FormFieldType[]) => {
                return fields.some((field: FormFieldType) => {
                    return field.hidden
                })
            })
        })
    )
})

const flowList = computed(() => {
    return useAppStore().flowList || []
})

const params = computed<ParamType[]>(() => {
    return useAppStore().params || []
})

const forms = computed(() => {
    return useAppStore().forms
})

const formButtonTitle = computed(() => {
    return localTask.value.buttonTitle ? `${localTask.value.buttonTitle}` : `${t('lang.CONFIRM')}`
})

const loadOrDialogModal = () => {
    if (localForm.value.formType === 'openFlow') {
        updateParams()
    } else {
        showModal.value = true
    }
}

const run = () => updateParams()

const close = () => {
    showModal.value = false
    emit('close')
}

const updateParamsWhenNeeded = (result) => {
    // used to table-to-param task
    if (result.params) {
        // $store.dispatch('app/setParams', result.params)
    }
}

const forceDefaultWhenEmpty = () => {
    const defaultParams = cloneDeep(useAppStore().params)
    const currentParams = cloneDeep(params.value)

    for (let param of currentParams) {
        if (
            (!param.paramValue && `${param.paramValue}` !== `0`) ||
            (isArray(param.paramValue) && param.paramValue.length <= 0)
        ) {
            const dft = defaultParams.find((p) => p.paramName === param.paramName)
            if (dft) {
                param.paramValue = dft.paramValue
            }
        }
    }

    return currentParams
}

const updateParams = () => {
    showModal.value = false
    const baseParams = cloneDeep(params.value)
    for (const item of baseParams) {
        if (item.paramName) {
            localForm.value.formElements.forEach((element) => {
                const field = Object.values(element.cols)
                    .flat()
                    .find((f) => f.paramName === item.paramName || f.extraParamName === item.paramName)

                if (field) {
                    if (field.type === 'slider') {
                        if (field.paramName === item.paramName) {
                            item.paramValue = field.value[0] || 0
                        } else if (field.extraParamName === item.paramName) {
                            item.paramValue = field.value[1] || 100
                        }
                    } else {
                        item.paramValue = field.value as string
                        item.all = field.all
                    }
                }
            })
        }
    }

    useAppStore().params = baseParams
    loadOrGoToFlow()
}

const from = computed(() =>
    router.currentRoute.value.name.toString() === ('preview' || 'dash' || 'portal') ? 'dash' : 'studio'
)

const adjustButtonThemeColor = () => {
    if (localTask.value.buttonTheme === 'primary') {
        localTask.value.buttonTheme = '#182EABun'
    } else if (localTask.value.buttonTheme === 'danger') {
        localTask.value.buttonTheme = '#e32'
    } else if (localTask.value.buttonTheme === 'success') {
        localTask.value.buttonTheme = '#2e8d2e'
    } else if (localTask.value.buttonTheme === 'warning') {
        localTask.value.buttonTheme = '#f4c20d'
    } else if (localTask.value.buttonTheme === 'info') {
        localTask.value.buttonTheme = '#2e8d2e'
    } else {
        localTask.value.buttonTheme = localTask.value.buttonTheme || '#182EAB'
    }
}

const loadOrGoToFlow = async () => {
    if (localForm.value.formType === 'loadFlow') {
        loading.value = true
        const flow = flowList.value.find((o) => o.flowId === localForm.value.flowId)

        await useApi()
            .post(`api/task/run-all`, {
                body: {
                    from: 'studio',
                    meta: {
                        appId: flow.appId,
                        flowId: flow.flowId,
                        flowTimeout: flow.options.flowTimeout
                    },
                    params: forceDefaultWhenEmpty(),
                    tasks: flow.workflow.nodes.map((node) => node)
                }
            })
            .then((res) => {
                updateParamsWhenNeeded(res.data)
                setTimeout(() => (loading.value = false))
            })
            .catch(() => {
                // $notify.error({
                //     position: 'bottom-right',
                //     duration: 2000
                // })
                // localForm.value.formOnError
                // (loading.value = false)
            })

        emit('close')
    } else {
        const { formReload, formResetParams, flowId } = localForm.value
        const flow = flowList.value.find((o) => o.flowId === flowId)
        emit('change', { ...flow, formReload, formResetParams })
    }
}

const readParam = async (paramValue: GenericValueType) => {
    if (paramValue && `${paramValue}`.trim().startsWith('{{')) {
        return await useApi()
            .post('api/task/custom-param', {
                body: {
                    params: [paramValue]
                }
            })
            .then((res) => (res && res[0] ? res[0].paramValue : ''))
            .catch(() => '')
    } else {
        return paramValue
    }
}

const prepareFieldValuesByParams = async () => {
    localForm.value = cloneDeep(forms.value.find((f) => f.formId === localTask.value.formId) || {})

    const baseParams = cloneDeep(params.value)

    for (const element of localForm.value.formElements) {
        for (const col in element.cols) {
            const fields = element.cols[col] || []

            // params comes from a parent source
            if (props.sourceParams) {
                const sourceParams = cloneDeep(props.sourceParams)
                for (const field of fields) {
                    const par = baseParams.find((p) => p.paramName === field.paramName)
                    if (par) {
                        if (sourceParams[field.paramName]) {
                            field.value = sourceParams[field.paramName] as string
                        } else if ('key' in sourceParams) {
                            field.value = ''
                        } else {
                            field.value = (await readParam(par.paramValue)) || field.value || ''
                        }
                    }
                }
            } else {
                // params comes from global params
                for (const field of fields) {
                    if (field.paramName) {
                        const par = baseParams.find((p) => p.paramName === field.paramName)
                        if (par) {
                            if (field.type === 'slider') {
                                const ext = baseParams.find((p) => p.paramName === field.extraParamName)
                                if (ext) {
                                    if (isNumber(Number(par.paramValue)) && isNumber(Number(ext.paramValue))) {
                                        field.value = []

                                        const min = Number(await readParam(par.paramValue))
                                        const max = Number(await readParam(ext.paramValue))
                                        field.value[0] =
                                            min >= field.sliderMinValue && min <= max ? min : field.sliderMinValue
                                        field.value[1] =
                                            max <= field.sliderMaxValue && max >= min ? max : field.sliderMaxValue
                                    } else {
                                        field.value = []
                                        field.value = [field.sliderMinValue, field.sliderMaxValue]
                                    }
                                }
                            } else {
                                field.value = await readParam(par.paramValue)
                            }
                        }
                    }
                }
            }
        }
    }

    // FINALLY, SET LOCAL FORM WITH ITS FORM_FIELDS
    localForm.value = Object.assign({}, localForm.value)
    fieldKey.value = getId()
    return { status: 'values prepared' }
}

onBeforeMount(async () => {
    localTask.value = props.task

    await prepareFieldValuesByParams()
    // SHOW MODAL AT LOAD WHEN IT IS A MODAL (MOST OF TIME IS CALLED FROM A TABLE)
    switch (localTask.value.formLoadType) {
        case 'modal':
            showModal.value = true
            type.value = 'button'
            break
        case 'aside':
            showModal.value = false
            type.value = 'card'
            break
        default:
            showModal.value = false
            type.value = localTask.value.formLoadType
            break
    }

    if (localForm.value.formConfirm) {
        localPopoverConfirm.value = false
    }
})

onMounted(() => adjustButtonThemeColor())

watch(
    () => paramsResetKey.value,
    () => {
        if (localForm.value.formResetParams) {
            prepareFieldValuesByParams()
        }
    }
)
</script>

<style lang="scss">
.report-forms {
    height: 100% !important;

    .no-card {
        background-color: transparent !important;
        border: none !important;
        padding: 0;
        margin: 0;

        .el-card__body {
            height: 100% !important;
            padding: 0 !important;
        }

        .card-body,
        .card-body-inner {
            padding: 0 !important;
        }
    }

    .card-body,
    .form-simple {
        height: 100%;
    }

    .bottom {
        margin-top: 13px;
        line-height: 12px;
        text-align: right;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: '';
    }
}
</style>
