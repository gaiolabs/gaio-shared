<template>
    <div class="task-builder-edit-computed me-2 flex h-full flex-col">
        <div class="flex gap-2">
            <div class="flex gap-2">
                <n-button @click="$emit('close')">
                    <g-icon name="close" />
                </n-button>
                <n-button
                    type="primary"
                    :disabled="!isValid"
                    @click="saveOrCreate()"
                >
                    {{ $t('saveComputed') }}
                </n-button>
                <n-button>
                    <g-icon name="globalComputed" />
                </n-button>
            </div>
            <g-define-column v-model="localComputed" />
        </div>
        <div class="flex grow flex-col py-2">
            <code-editor
                :key="localComputed.computedId"
                v-model="localComputed.content"
                class="h-full overflow-hidden rounded"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { type BuilderTaskType, type FieldType, type SchemaComputedType } from '@gaio/types'
import { getId } from '@gaio/utils'
import { bridgeDataType } from '@gaio/utils/libs/dataTypeHelper'
import { cloneDeep } from 'lodash-es'
import { onMounted, type PropType } from 'vue'
import { computed, ref } from 'vue'

import useValidate from '@/composables/useValidate'

const emit = defineEmits(['close'])
const props = defineProps({
    localField: {
        type: Object as PropType<{ type: string; field: Partial<FieldType> }>,
        required: true
    },
    localTask: {
        type: Object as PropType<BuilderTaskType>,
        required: true,
        default: () => null as BuilderTaskType
    }
})

const localComputed = ref<SchemaComputedType>({
    id: undefined,
    computedId: undefined,
    columnName: '',
    alias: '',
    content: '',
    global: false,
    dataType: 'Nullable(String)',
    columnLength: undefined,
    type: 'computed'
})

const isValid = computed(() => {
    return useValidate().isValid(localComputed.value, {
        columnName: 'string|min:1',
        content: 'string|min:1',
        dataType: 'string'
    })
})

const saveOrCreate = () => {
    const setComputed = (comp) => {
        if (comp.computedId && comp.computedId === localComputed.value.computedId) {
            return cloneDeep({ ...comp, ...localComputed.value })
        } else {
            return cloneDeep(comp)
        }
    }

    localComputed.value = bridgeDataType(localComputed.value, true)
    localComputed.value.alias = localComputed.value.columnName

    if (localComputed.value.global && !localComputed.value.globalId) {
        localComputed.value.globalId = getId(6)
    }

    if (!localComputed.value.computedId) {
        localComputed.value.computedId = getId(6)
        props.localTask.schema.computed.push(localComputed.value)
    } else {
        for (const prop in props.localTask.schema) {
            if (props.localTask.schema && props.localTask.schema[prop]) {
                if (props.localTask.schema[prop] instanceof Array) {
                    if (prop === 'filter' || prop === 'having') {
                        props.localTask.schema[prop].forEach((filter, filterKey) => {
                            if (filter.list && filter.list.length > 0) {
                                filter.list.forEach((lis, lisKey) => {
                                    props.localTask.schema[prop][filterKey].list[lisKey] = setComputed(lis)
                                })
                            }
                        })
                    } else {
                        props.localTask.schema[prop].forEach(
                            (cp, cpKey) => (props.localTask.schema[prop][cpKey] = setComputed(cp))
                        )
                    }
                }
            }
        }
    }

    emit('close')
}

onMounted(() => (localComputed.value = cloneDeep(props.localField.field)))
</script>

<style>
.cm-scroller,
.cm-editor {
    max-height: 100% !important;
}
</style>
