<template>
    <div v-if="localField" class="report-field col rounded p-1" :class="{
        'edit-col': edit && isCurrentField
    }">
        {{ field.value }}
        <!--FIELD LABEL-->
        <div class="control-label flex justify-between">
            <div>
                <template v-if="hasTitle">
                    {{ localField.label }}
                </template>
            </div>
            <div v-if="edit">
                <n-button text type="error" @click="useFormStore().deleteFieldById(localField.id)">
                    <template #icon>
                        <g-icon name="delete" />
                    </template>
                </n-button>
            </div>
        </div>
        <!--DESCRIPTION-->
        <template v-if="localField.type === 'description'">
            <report-tip-tap :edit="edit" :content="localField.description" />
        </template>
        <!-- DIVIDER -->
        <template v-else-if="localField.type === 'divider'">
            <n-divider />
        </template>
        <!--INPUT FIELDS-->
        <template v-else>
            <!-- I::TEXT-->
            <template v-if="localField.type === 'lineText'">
                <template v-if="localField.longText">
                    <n-input :key="localField.paramName" v-model:value="localField.value"
                        :maxlength="localField.max || 255" :readonly="localField.readonly"
                        :placeholder="localField.placeholder" :rows="localField.textareaRows || 2" show-count
                        type="textarea" @blur="executeWhenFilter" />
                </template>
                <n-input v-else :key="localField.paramName" v-model:value="localField.value"
                    :maxlength="localField.max || 255" :readonly="localField.readonly"
                    :placeholder="localField.placeholder" @blur="executeWhenFilter" />
            </template>
            <!-- I::NUMBER-->
            <template v-else-if="localField.type === 'lineNumber'">
                <n-input-number v-model:value="localField.value" :placeholder="localField.placeholder" @blur="run()" />
            </template>
            <!-- I::DATE RANGE -->
            <template v-else-if="localField.type === 'date'">
                <n-date-picker v-if="!localField.isRange" v-model:formatted-value="localField.value"
                    :readonly="localField.readonly" :size="fieldSize" :type="customDateType(localField)"
                    :placeholder="localField.placeholder" :format="localDateFormat" value-format="yyyy-MM-dd"
                    @update:value="executeWhenFilter" />
                <n-date-picker v-else v-model:formatted-value="extraListValue" :readonly="localField.readonly"
                    :size="fieldSize" :type="customDateRangeType(localField)" :placeholder="localField.placeholder"
                    :format="localDateFormat" value-format="yyyy-MM-dd" @update:value="executeWhenFilter" />
            </template>
            <!-- I::DATETIME-->
            <template v-else-if="localField.type === 'datetime'">
                <n-date-picker v-model:formatted-value="localField.value" :readonly="localField.readonly"
                    :size="fieldSize" :type="customDateType(field)" :placeholder="localField.placeholder"
                    :format="localField.labelFormat" value-format="yyyy-MM-dd HH:mm:ss"
                    @update:value="executeWhenFilter" />
            </template>
            <!-- I::TIME -->
            <template v-else-if="localField.type === 'time'">
                <n-time-picker v-model:formatted-value="localField.value" :readonly="localField.readonly"
                    :size="fieldSize" :placeholder="localField.placeholder" :format="localField.labelFormat"
                    value-format="HH:mm:ss" @update:value="executeWhenFilter" />
            </template>
            <!-- I::SELECT -->
            <template v-else-if="localField.type === 'select'">
                <n-select :key="`${localKey}_${localField.paramName || ''}`" v-model:value="localField.value"
                    :options="localList" :readonly="localField.readonly" :placeholder="localField.placeholder"
                    :multiple="localField.multiple" filterable @update:value="executeWhenFilter" />
            </template>
            <!-- I::SLIDER -->
            <template v-else-if="localField.type === 'slider'">
                <n-slider v-if="localField.sliderType === 'monthly'" v-model:value="extraListValue"
                    :min="localField.sliderMinValue" :max="localField.sliderMaxValue" :step="localField.sliderStepValue"
                    :format-tooltip="sliderMonthlyTooltip" :disabled="localField.readonly"
                    @update:value="executeWhenFilter" />
                <n-slider v-else v-model:value="extraListValue" :min="localField.sliderMinValue"
                    :max="localField.sliderMaxValue" :step="localField.sliderStepValue" range
                    @update:value="executeWhenFilter" />
            </template>
            <!-- I::CHECKBOX -->
            <template v-else-if="localField.type === 'checkbox'">
                <div class="flex gap-1"
                    :class="{ 'flex-col': localField.isVertical, 'items-center': !localField.isVertical }">
                    <template v-if="localField.isButton">
                        <n-button-group :vertical="localField.isVertical">
                            <n-button v-for="(li, liIndex) in localList" :key="liIndex" size="small"
                                :type="extraListValue.includes(li.value) ? 'primary' : 'default'"
                                @click="addOrRemoveInList(li.value)">
                                {{ li.label }}
                            </n-button>
                        </n-button-group>
                        <!--                        <div class="checkbox-grid">-->
                        <!--                            <div>-->
                        <!--                                <n-checkbox-group-->
                        <!--                                    :size="localField.buttonSize"-->
                        <!--                                    v-model:value="localField.value"-->
                        <!--                                    @change="clearWhenAllIsSelected(field)"-->
                        <!--                                >-->
                        <!--                                    <el-checkbox-button-->
                        <!--                                        :size="field.buttonSize"-->
                        <!--                                        :readonly="field.readonly"-->
                        <!--                                        v-for="(li, liIndex) in field.list.filter((o) => o.value)"-->
                        <!--                                        :key="liIndex"-->
                        <!--                                        :label="li.value"-->
                        <!--                                    >-->
                        <!--                                        {{ li.label }}-->
                        <!--                                    </el-checkbox-button>-->
                        <!--                                </n-checkbox-group>-->
                        <!--                            </div>-->
                        <!--                            <div-->
                        <!--                                v-show="isFilter"-->
                        <!--                                class="checkbox-filter-button d-flex"-->
                        <!--                            >-->
                        <!--                                <el-divider direction="vertical" />-->
                        <!--                                <el-button-->
                        <!--                                    @click="run()"-->
                        <!--                                    :size="localField.buttonSize"-->
                        <!--                                    key="apply"-->
                        <!--                                    type="primary"-->
                        <!--                                >-->
                        <!--                                    <g-icon name="g-input-checkbox" />-->
                        <!--                                </el-button>-->
                        <!--                            </div>-->
                        <!--                        </div>-->
                    </template>
                    <template v-else>
                        <n-checkbox-group v-model:value="extraListValue" class="flex gap-1"
                            :class="{ 'flex-col': localField.isVertical, 'items-center': !localField.isVertical }"
                            @update:value="executeWhenFilter">
                            <n-checkbox v-for="(li, liIndex) in localList" :key="liIndex"
                                :readonly="localField.readonly" :label="li.label" :value="li.value" />
                        </n-checkbox-group>
                    </template>
                    <template v-if="!isFilter">
                        <div :class="{
                            'flex items-center': !localField.isVertical
                        }">
                            <n-divider :vertical="!localField.isVertical" />
                            <n-button size="small" type="primary" :block="localField.isVertical && localField.isButton"
                                ghost @click="executeWhenFilter()">
                                {{ $t('confirm') }}
                            </n-button>
                        </div>
                    </template>
                </div>
            </template>
            <!-- I::RADIO -->
            <template v-else-if="localField.type === 'radio'">
                <n-radio-group v-if="localField.isButton" v-model:value="localField.value"
                    @update:value="executeWhenFilter">
                    <n-radio-button v-for="(li, liIndex) in localList" :key="liIndex" :readonly="localField.readonly"
                        :label="li.label" :value="li.value" />
                </n-radio-group>
                <n-radio-group v-else v-model:value="localField.value" @update:value="executeWhenFilter">
                    <n-radio v-for="(li, liIndex) in localList" :key="liIndex" :readonly="localField.readonly"
                        :class="{ 'w-full': localField.isVertical }" :label="li.label" :value="li.value" />
                </n-radio-group>
            </template>
        </template>
    </div>
</template>

<script setup lang="ts">
import type { FormFieldType } from '@gaio/shared/types'
import { definedOrDefault } from '@gaio/shared/utils'
import { format } from 'date-fns'
import dayjs from 'dayjs'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import useApi from '@/composables/useApi'
import { useAppStore, useFormStore } from '@/stores'
import ReportTipTap from '@/views/report/report-tip-tap/ReportTipTap.vue'

const emit = defineEmits(['run', 'change'])
const props = withDefaults(defineProps<{ field: FormFieldType; edit: boolean; isFilter?: boolean }>(), {
    field: null,
    edit: false,
    isFilter: false
})

const { t } = useI18n()
const localField = computed<FormFieldType>(() => props.field)
const localDateFormat = ref()
const extraListValue = ref([])
const localKey = ref('any')
const localList = ref([{ label: t('none'), value: '' }])

const adjustLabelForm = () => {
    try {
        format(new Date(), localField.value.labelFormat)
        localDateFormat.value = localField.value.labelFormat
    } catch (e) {
        if (localField.value.type === 'date') {
            localDateFormat.value = 'yyyy-MM-dd'
        } else if (localField.value.type === 'datetime') {
            localDateFormat.value = 'yyyy-MM-dd HH:mm:ss'
        } else if (localField.value.type === 'time') {
            localDateFormat.value = 'HH:mm:ss'
        }
        localDateFormat.value = null
    }
}

const executeWhenFilter = () => {
    if (props.isFilter) {
        emit('run')
    }
}

const customDateRangeType = (item: FormFieldType) => {
    if (item.type === 'date') {
        switch (item.datePickerType) {
            case 'date':
                return 'daterange'
            case 'year':
                return 'yearrange'
            case 'month':
                return 'monthrange'
            default:
                return 'daterange'
        }
    }
    return item.type
}

const customDateType = (item: FormFieldType) => {
    switch (item.datePickerType) {
        case 'date':
            return 'date'
        case 'year':
            return 'year'
        case 'month':
            return 'month'
        // case 'daterange':
        //     return 'daterange'
        case 'week':
            return 'week'
        default:
            if (item.type === 'datetime') {
                return 'datetime'
            }
            return 'date'
    }
}

const addOrRemoveInList = (value: string) => {
    extraListValue.value =
        extraListValue.value.includes(value) ?
            extraListValue.value.filter((item) => item !== value)
            : [...extraListValue.value, value]
}

const sliderMonthlyTooltip = (value: number) => {
    switch (value) {
        case 1:
            return t('jan')
        case 2:
            return t('feb')
        case 3:
            return t('mar')
        case 4:
            return t('apr')
        case 5:
            return t('may')
        case 6:
            return t('jun')
        case 7:
            return t('jul')
        case 8:
            return t('aug')
        case 9:
            return t('sep')
        case 10:
            return t('oct')
        case 11:
            return t('nov')
        case 12:
            return t('dec')
        default:
            return t('noDataSentence')
    }
}

const prepareWhenExtraValues = () => {
    extraListValue.value = []

    if (localField.value.type === 'slider' && localField.value.sliderType === 'monthly') {
        extraListValue.value = [
            definedOrDefault(localField.value.sliderMinValue, 1),
            definedOrDefault(localField.value.sliderMaxValue, 12)
        ]
    } else if (localField.value.type === 'slider') {
        extraListValue.value = [
            definedOrDefault(localField.value.sliderMinValue, 0),
            definedOrDefault(localField.value.sliderMaxValue, 100)
        ]
    } else if (localField.value.type === 'checkbox') {
        extraListValue.value = null
    } else if (localField.value.type === 'date') {
        // if (localField.value.isRange) {
        //     extraListValue.value = [definedOrDefault(localField.value.value, null)]
        // } else {
        //     extraListValue.value = definedOrDefault(localField.value.value, null)
        // }
    }

    extraListValue.value = null
}

const prepareWhenDateField = () => {
    if (!localField.value.value) {
        localField.value.value = null
        return
    }

    // Value
    try {
        if (typeof localField.value.value === 'string') {
            if (localField.value.type === 'date') {
                localField.value.value = dayjs(localField.value.value).format('YYYY-MM-DD')
            } else if (localField.value.type === 'datetime') {
                localField.value.value = dayjs(localField.value.value).format('YYYY-MM-DD HH:mm:ss')
            } else if (localField.value.type === 'time') {
                const date = dayjs().format('YYYY-MM-DD') + ' ' + localField.value.value.slice(-8)
                localField.value.value = dayjs(date).format('HH:mm:ss')
            }
        }
        // Extra Value
        if (localField.value.isRange) {
            if (typeof localField.value.value === 'object' && localField.value.value.length === 2) {
                localField.value.value = [
                    dayjs(localField.value.value[0]).format('YYYY-MM-DD'),
                    dayjs(localField.value.value[1]).format('YYYY-MM-DD')
                ]
            } else {
                localField.value.value = [null, null]
            }
        }
    } catch (e) {
        console.log('Date error parser')
        localField.value.value = null
    }

    // Extra Value
    try {
        if (localField.value.isRange) {
            if (localField.value.type === 'date') {
                localField.value.extraValue = dayjs(localField.value.value as string).format('YYYY-MM-DD')
            } else if (localField.value.type === 'datetime') {
                localField.value.value = dayjs(localField.value.value as string).format('YYYY-MM-DD HH:mm:ss')
            } else if (localField.value.type === 'time') {
                if (localField.value.value !== null && typeof localField.value.value !== 'number') {
                    const date = dayjs().format('YYYY-MM-DD') + ' ' + localField.value.value.slice(-8)
                    localField.value.value = dayjs(date).format('HH:mm:ss')
                }
            }
        }
    } catch (e) {
        console.log('Date error parser')
        localField.value.value = null
    }
}

const prepareWhenWhenListFields = async () => {
    let baseList = []

    if (localField.value.source === 'bucket') {
        const field = localField.value
        const tableName = field.bucketTable
        const appInfo = useAppStore().appInfo
        const databaseName = field.bucketDatabase || appInfo.databaseName

        const colValue = {
            tableName,
            databaseName,
            alias: 'value',
            type: 'value'
        }
        const colLabel = {
            tableName,
            databaseName,
            alias: 'label',
            type: 'value'
        }

        const taskData = {
            ...appInfo,
            type: 'table',
            sourceType: 'bucket',
            databaseName,
            tableName,
            schema: {
                limit: field.bucketFieldLimit || 1000,
                select: [
                    {
                        columnName: field.bucketFieldValue,
                        ...colValue
                    },
                    {
                        columnName: field.bucketFieldLabel || field.bucketFieldValue,
                        ...colLabel
                    }
                ],
                group: [
                    {
                        columnName: field.bucketFieldValue,
                        ...colValue
                    },
                    ...(field.bucketFieldValue !== field.bucketFieldLabel ?
                        [
                            {
                                columnName: field.bucketFieldLabel,
                                ...colValue
                            }
                        ]
                        : [])
                ],
                sort:
                    ['asc', 'desc'].includes(field.bucketFieldOrder) ?
                        [
                            {
                                columnName: field.bucketFieldValue,
                                order: field.bucketFieldOrder,
                                ...colValue
                            }
                        ]
                        : []
            }
        }

        const { data } = await useApi().post(`api/table/rows`, {
            body: {
                taskData
            }
        })
        baseList = data
    } else {
        baseList = localField.value.list
    }

    if (localField.value.required) {
        localList.value = localList.value.concat(baseList)
    } else {
        localList.value = baseList
    }

    localList.value.map((item) => {
        return {
            label: item.label || item.value,
            value: item.value
        }
    })
}

const isCurrentField = computed(() => {
    return useFormStore().currentField?.id === localField.value.id
})

const hasTitle = computed(() => {
    return !['description', 'divider'].includes(localField.value.type)
})

const fieldSize = computed(() => {
    return localField.value.fieldSize || 'small'
})

watch(
    () => localField.value.labelFormat,
    () => {
        // date-fns throw errs when format label is wrong,
        // this prevents errors at the app
        adjustLabelForm()
    },
    {
        immediate: true
    }
)

onBeforeMount(() => {
    adjustLabelForm()
    prepareWhenDateField()
    prepareWhenWhenListFields()
    prepareWhenExtraValues()
})
</script>

<style lang="scss" scoped>
.col {
    padding: 0.2rem;
    border: 1px dashed transparent;
    border-radius: 4px;
}

.edit-col {
    border: 1px dashed var(--prime);
}
</style>
