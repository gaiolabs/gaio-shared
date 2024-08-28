<template>
    <div class="task-builder-menu flex w-full items-center gap-3 p-3 px-0">
        <div class="flex items-center gap-1 text-lg font-bold">
            <g-icon name="staticContent" />
            {{ $t('content') }}
        </div>
        <div class="flex grow items-center justify-between gap-2 px-3">
            <div class="flex items-center gap-2">
                <n-input v-model:value="localTask.label" size="small" :placeholder="$t('task')" />
                <n-divider vertical />
                <n-button size="small" @click="save()">
                    {{ $t('save') }}
                </n-button>
            </div>
            <n-button-group size="small">
                <n-button :type="showTab === 'builder' ? 'primary' : 'default'" secondary class="border-elevation-2"
                    @click="$emit('showTab', 'builder')">
                    <g-icon name="eye" />
                </n-button>
                <n-button :type="showTab === 'preview' ? 'primary' : 'default'" secondary class="border-elevation-2"
                    @click="$emit('showTab', 'preview')">
                    <g-icon name="file" />
                </n-button>
                <n-button :type="showTab === 'sql' ? 'primary' : 'default'" secondary class="border-elevation-2"
                    @click="$emit('showTab', 'sql')">
                    <g-icon name="eye-off" />
                </n-button>
            </n-button-group>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getBucketNameFromAppId, getId } from '@gaio/shared/utils'
import { flatMap, uniqBy } from 'lodash-es'
import type { PropType } from 'vue'

import useDefault from '@/composables/useDefault'
import useFlow from '@/composables/useFlow'
import { useAppStore } from '@/stores'
import type { StaticContentType } from '@gaio/shared/types/tasks/static-content.type'


const props = defineProps({
    localTask: {
        type: Object as PropType<StaticContentType>,
        required: true,
        default: () => ({}) as StaticContentType
    },
    showTab: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['showTab', 'close'])

const save = () => {
    const task = props.localTask
    if (task.id === undefined) task.id = getId()
    const taskToBeSaved = useDefault({
        type: 'sample',
        base: {
            ...useAppStore().appInfo,
            ...task
        }
    })
    console.log("task", task)
    console.log("taskToBeSaved", taskToBeSaved)
    // useFlow(useAppStore().flow.workflow)
    //     .generate({
    //         task: taskToBeSaved,
    //         sources: [],
    //         targets: []
    //     })
    //     .save()
    //     .then(() => emit('close'))
}
</script>
