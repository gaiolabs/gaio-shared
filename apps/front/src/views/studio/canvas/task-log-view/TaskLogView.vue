<template>
    <drawer-view
        class="task-log-view"
        @close="$emit('close')"
    >
        <template #header>
            <div class="flex items-center gap-3 p-3">
                <div class="flex items-center gap-1 font-bold">
                    <g-icon name="logs" />
                    {{ $t('logs') }}
                </div>
                <div></div>
            </div>
        </template>
        <template #contentScroll>
            <div
                ref="localContent"
                class="h-full"
            >
                <div v-if="!jobList?.length">
                    <n-alert class="border-elevation-2">
                        <template #title>
                            {{ $t('noData') }}
                        </template>
                    </n-alert>
                </div>
                <div
                    v-else
                    class="m-3 pb-3"
                >
                    <n-collapse>
                        <n-collapse-item
                            v-for="(job, index) of jobList"
                            :key="index"
                            :name="index"
                        >
                            <template #header>
                                <div class="flex w-full items-center justify-between">
                                    <div>
                                        <div>
                                            {{ getFlowName(job.flowId) }}
                                        </div>
                                    </div>
                                    <div></div>
                                </div>
                            </template>
                            <template #header-extra>
                                <div class="item-center flex gap-2 px-1">
                                    <div class="w-[90px] text-right">
                                        {{ timeSpent(job) }}
                                    </div>
                                    <n-divider
                                        vertical
                                        class="m-0 p-0"
                                    />
                                    <div
                                        v-if="job.status === 'started'"
                                        class="w-[90px]"
                                    >
                                        <n-button
                                            class="w-full"
                                            size="small"
                                            status="danger"
                                            @click="abortWorkflow(job.id)"
                                        >
                                            {{ $t('stop') }}
                                        </n-button>
                                    </div>
                                    <div
                                        v-else-if="job.aborted"
                                        class="w-[90px]"
                                    >
                                        <n-tag
                                            :bordered="false"
                                            :color="tagPurple"
                                            class="w-full justify-center"
                                        >
                                            {{ $t('aborted') }}
                                        </n-tag>
                                    </div>
                                    <div
                                        v-else
                                        class="w-[90px]"
                                    >
                                        <n-tag
                                            :color="tagGray"
                                            class="w-full justify-center"
                                        >
                                            {{ $t('finished') }}
                                        </n-tag>
                                    </div>
                                </div>
                            </template>
                            <div class="px-2">
                                <div
                                    v-for="value of job.tasks"
                                    :key="value.taskId"
                                    class="mb-1 flex w-full items-center justify-between border-b px-2 pb-1 last:border-none"
                                >
                                    <div class="flex">
                                        <div>{{ getTaskLabel(value.flowId, value.taskId) }}</div>
                                        <div>{{ getResultSource(value.flowId, value.taskId) }}</div>
                                    </div>
                                    <div class="flex">
                                        <div class="flex items-center gap-2">
                                            <div>
                                                {{ timeSpent(value) }}
                                            </div>
                                            <n-divider
                                                vertical
                                                class="m-0 p-0"
                                            />
                                            <div class="w-[80px]">
                                                <n-tag
                                                    class="w-full justify-center"
                                                    bordered
                                                    :color="singleTaskJobStatus(value)"
                                                    @click="activeModalMessage(value['message'])"
                                                >
                                                    {{ $t(value.status) }}
                                                </n-tag>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </n-collapse-item>
                    </n-collapse>
                </div>
                <n-modal
                    v-model:visible="showMessage"
                    :ok-text="$t('ok')"
                    hide-cancel
                >
                    <template #title>{{ $t('message') }}</template>
                    <n-scrollbar style="max-height: 300px; overflow: auto; padding: 10px">
                        {{ currentMessage }}
                    </n-scrollbar>
                </n-modal>
            </div>
        </template>
    </drawer-view>
</template>
<script setup lang="ts">
import type { TaskType } from '@gaio/types'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import { computed, onMounted, ref } from 'vue'

import useApi from '@/composables/useApi'
import { useAppStore } from '@/stores'
import { useJobStore } from '@/stores/useJobStore'

defineEmits(['close'])

dayjs.extend(duration)
dayjs.extend(relativeTime)

const flowBase = ref({})

const tagPurple = {
    borderColor: 'rgb(222,182,255)',
    color: 'rgb(245,232,255)',
    textColor: 'rgb(114,46,209)'
}

const tagGray = {
    borderColor: 'rgb(242,243,245)',
    color: 'rgb(242,243,245)',
    textColor: 'rgb(134,144,156)'
}

const tagGreen = {
    borderColor: 'rgb(185,252,190)',
    color: 'rgb(232,255,234)',
    textColor: 'rgb(0,180,42)'
}

const tagRed = {
    borderColor: 'rgb(255,184,171)',
    color: 'rgb(255,236,232)',
    textColor: 'rgb(245,63,63)'
}

const tagBlue = {
    borderColor: 'rgb(167,203,255)',
    color: 'rgb(232,243,255)',
    textColor: 'rgb(22,93,255)'
}

const showMessage = ref(false)
const currentMessage = ref('')

const activeModalMessage = (message: string) => {
    if (message) {
        currentMessage.value = message
        showMessage.value = true
    }
}

const singleTaskJobStatus = (value) => {
    return (
        value.status === 'started' ? tagBlue
        : value.status === 'error' ? tagRed
        : tagGreen
    )
}

const abortWorkflow = async (id: string) => {
    await useApi().post('api/task/abort', {
        body: {
            id
        }
    })
}

const timeSpent = (value) => {
    let startedAt = dayjs(value.startedAt)
    let endedAt = dayjs(value.endedAt)
    let diff = endedAt.diff(startedAt) // difference in milliseconds

    let hours = Math.floor(diff / 1000 / 60 / 60)
    let minutes = Math.floor((diff / 1000 / 60) % 60)
    let seconds = Math.floor((diff / 1000) % 60)

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`
}

const getResultSource = (flowId, taskId) => {
    const flow = flowBase.value[flowId]
    const resultTable = flow?.tasks[taskId]?.resultTable

    if (resultTable) {
        return ' -> ' + resultTable
    }
    return ''
}

const getFlowName = (flowId: string) => {
    const flow = flowBase.value[flowId]
    return flow?.flowName || ''
}

const getTaskLabel = (flowId: string, taskId: string) => {
    const flow = flowBase.value[flowId]
    return flow?.tasks[taskId]?.label || ''
}

const getTaskMetadata = (task: TaskType & { flowId: string }) => {
    const flow = flowBase.value[task.flowId]
    if (flow) {
        const taskMeta = flow['tasks'][task['taskId']]
        if (taskMeta) {
            return taskMeta
        }
    }
    return {
        flowName: ''
    }
}

const jobList = computed(() => {
    return useJobStore().jobList.map((job) => {
        if (job.tasks) {
            for (const [key, value] of Object.entries(job.tasks)) {
                job.tasks[key] = {
                    ...getTaskMetadata({
                        flowId: job.flowId,
                        taskId: key
                    }),
                    ...value
                }
            }
        }
        return job
    })
})

onMounted(() => {
    flowBase.value = useAppStore().flowList.reduce((acc, flow) => {
        acc[flow.flowId] = {
            flowName: flow.flowName,
            tasks: {}
        }

        acc[flow.flowId].tasks = flow.workflow.nodes.reduce((acc, task) => {
            acc[task.id] = task
            return acc
        }, {})

        return acc
    }, {})
})
</script>

<style lang="scss">
.task-log-view {
    .n-collapse {
        border-radius: 4px;
        border: 1px solid var(--elevation-2);
        overflow: hidden;
        background: var(--elevation-1);
    }

    .n-collapse-item__header {
        background: var(--elevation-0);
        min-height: 37px;
    }

    .n-collapse-item--active {
        .n-collapse-item__header {
            border-bottom: 1px solid var(--elevation-2);
            transition: border-color 0s ease 0s;
        }
    }

    .n-collapse .n-collapse-item:not(:first-child) {
        margin-top: 0 !important;
    }

    .drawer-content {
        display: grid;
        height: 293px;
    }
}
</style>
