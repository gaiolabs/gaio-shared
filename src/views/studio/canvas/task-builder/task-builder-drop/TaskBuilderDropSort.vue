<template>
    <div class="task-builder-drop-sort block">
        <div class="mx-1 flex items-center justify-between gap-1">
            <div class="flex items-center gap-1 font-bold">
                <g-icon name="sort" />
                {{ $t('sort') }}
                <span v-if="localTask.schema.sort.length">({{ localTask.schema.sort.length }})</span>
            </div>
            <div class="mb-1">
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
        <task-builder-drop-tag
            custom-class="sort"
            :fields="localTask.schema.sort as FieldType[]"
            @choose="$emit('choose', $event)"
        />
    </div>
</template>
<script setup lang="ts">
import type { BuilderTaskType, FieldType } from '@gaio/types'
import type { PropType } from 'vue'

import TaskBuilderDropTag from '@/views/studio/canvas/task-builder/task-builder-tags/TaskBuilderDropTag.vue'
defineEmits(['choose'])
const props = defineProps({
    localTask: {
        type: Object as PropType<BuilderTaskType>,
        required: true,
        default: () => null as BuilderTaskType
    }
})
const removeAll = () => {
    props.localTask.schema.select = []
}
</script>
