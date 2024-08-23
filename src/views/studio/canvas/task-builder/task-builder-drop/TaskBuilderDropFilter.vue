<template>
    <div class="task-builder-drop-filter">
        <div class="mx-1 flex items-center justify-between gap-1">
            <div class="flex items-center gap-1 font-bold">
                <g-icon :name="type" />
                {{ $t(type) }}
            </div>
            <div class="mb-1 flex gap-1">
                <n-tooltip :delay="1000">
                    <template #trigger>
                        <n-button
                            quaternary
                            size="tiny"
                            class="border-elevation-2 bg-paper-100 dark:bg-carbon-200"
                            @click="addFilter()"
                        >
                            <template #icon>
                                <g-icon name="addFilter" />
                            </template>
                        </n-button>
                    </template>
                    {{ $t('addFilter') }}
                </n-tooltip>

                <n-tooltip :delay="1000">
                    <template #trigger>
                        <n-button
                            quaternary
                            size="tiny"
                            type="error"
                            class="border-elevation-2 bg-paper-100 dark:bg-carbon-200"
                            @click="removeAll()"
                        >
                            <template #icon>
                                <g-icon name="deleteTag" />
                            </template>
                        </n-button>
                    </template>
                    {{ $t('deleteAllTags') }}
                </n-tooltip>
            </div>
        </div>

        <div
            v-for="(filter, filterIndex) of localFilter"
            :key="filterIndex"
            class="flex gap-2"
        >
            <div
                v-if="filterIndex > 0"
                class="flex min-w-[48px] justify-center"
            >
                <n-button
                    class="custom-rounded-button"
                    size="tiny"
                    quaternary
                    @click="interchangeAndOr(filter)"
                >
                    {{ $t(filter.andOr) }}
                </n-button>
            </div>
            <task-builder-drop-tag-filter
                class="mb-2"
                :fields="filter.list"
                @choose="$emit('choose', $event)"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { BuilderTaskType, SchemaFilterType } from '@gaio/types'
import { onMounted, type PropType, ref } from 'vue'

import TaskBuilderDropTagFilter from '@/views/studio/canvas/task-builder/task-builder-tags/TaskBuilderDropTagFilter.vue'

defineEmits(['choose'])

const props = defineProps({
    localTask: {
        type: Object as PropType<BuilderTaskType>,
        required: true,
        default: () => null as BuilderTaskType
    },
    type: {
        type: String as PropType<keyof BuilderTaskType['schema']>,
        required: true
    }
})

const addFilter = () => {
    localFilter.value.splice(localFilter.value.length, 0, {
        list: [],
        andOr: 'and',
        operator: '='
    })
}

const interchangeAndOr = (field: SchemaFilterType) => {
    field.andOr = field.andOr === 'and' ? 'or' : 'and'
}

const removeAll = () => {
    props.localTask[props.type] = [
        {
            list: [],
            andOr: 'and',
            operator: '='
        }
    ] as Partial<SchemaFilterType>[]
}

const localFilter = ref<SchemaFilterType[]>([])

onMounted(() => {
    localFilter.value = props.localTask.schema[props.type] as SchemaFilterType[]
})
</script>

<style scoped>
.custom-rounded-button {
    border-radius: 100%;
    height: 30px;
    width: 30px;
    border: 1px solid #fff;
    box-shadow: 0 0 2px #666;
    padding: 0;
    font-size: 12px;
}
</style>
