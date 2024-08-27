<template>
    <g-dialog v-if="localFlow && localFlow.options" @close="$emit('close')">
        <template #title>
            <div class="flex w-full items-center justify-between">
                <div class="flex items-center gap-2">
                    <div v-if="localFlow.appId">
                        <g-icon name="flow" />
                        {{ localFlow.flowName ? localFlow.flowName : $t('flow') }}
                    </div>
                    <div v-else>
                        <g-icon name="flow" />
                        {{ $t('newFlow') }}
                    </div>
                </div>
                <template v-if="localFlow.flowId">
                    <g-id :id="localFlow.flowId" />
                </template>
            </div>
        </template>
        <template #tabs>
            <div class="flow-control">
                <n-tabs pane-class="bg-elevation-1" size="small" type="line" :default-value="currentTab">
                    <n-tab-pane name="general" :tab="$t('general')" display-directive="show:lazy">
                        <flow-control-general :local-flow="localFlow" class="my-4" />
                    </n-tab-pane>
                    <n-tab-pane v-if="localFlow && localFlow.flowId" name="schedule" :tab="$t('schedule')"
                        display-directive="show:lazy">
                        <flow-control-schedule :local-flow="localFlow" class="my-4" />
                    </n-tab-pane>
                </n-tabs>
            </div>
            <div class="flex justify-between bg-paper-100 px-4 py-2 dark:bg-carbon-200">
                <div>
                    <n-space v-if="localFlow.flowId" size="small">
                        <n-popconfirm v-if="canDeleteFlow" :show-icon="false" :positive-button-props="{ type: 'error' }"
                            :positive-text="$t('delete')" @positive-click="remove()">
                            <template #trigger>
                                <n-button size="tiny" quaternary type="error">
                                    <template #icon>
                                        <g-icon name="delete" />
                                    </template>
                                </n-button>
                            </template>
                            {{ $t('deletionConfirmation') }}
                        </n-popconfirm>
                        <n-button size="tiny" quaternary type="primary" @click="replicateFlow()">
                            <template #icon>
                                <g-icon name="clone" />
                            </template>
                        </n-button>
                    </n-space>
                </div>
                <n-space>
                    <n-button secondary @click="$emit('close')">
                        {{ $t('cancel') }}
                    </n-button>
                    <n-button :loading="loading" type="primary" @click="save()">
                        {{ $t('save') }}
                    </n-button>
                </n-space>
            </div>
        </template>
    </g-dialog>
</template>

<script setup lang="ts">
import type { FlowType } from '@gaio/shared/types'
import { cloneDeep } from 'lodash-es'
import { NButton } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'

import useApi from '@/composables/useApi'
import { useAppStore } from '@/stores'

import FlowControlGeneral from './FlowControlGeneral.vue'
import FlowControlSchedule from './FlowControlSchedule.vue'

const props = defineProps<{ flow: Partial<FlowType> }>()
const emit = defineEmits(['close', 'save'])
const localFlow = ref<FlowType | null>()
const currentTab = ref('general')
const loading = ref(false)

const save = async () => {
    loading.value = true
    const savedFlow = await useApi('flowControl').post('api/flow/save', {
        body: {
            flowData: localFlow.value
        }
    })

    if (savedFlow.flowId) {
        const index = useAppStore().flowList.findIndex((flow) => flow.flowId === savedFlow.flowId)
        if (index !== -1) {
            console.log('updates')
            useAppStore().flowList[index] = savedFlow
        } else {
            useAppStore().flowList.push(savedFlow)
        }
        useAppStore().flow = savedFlow
    }

    emit('save')
}

const canDeleteFlow = computed(() => {
    return useAppStore().flowList.length > 1
})

const remove = async () => {
    loading.value = true
    await useApi().post('api/flow/remove', {
        body: {
            flowId: localFlow.value.flowId,
            appId: localFlow.value.appId
        }
    })

    useAppStore().flowList = useAppStore().flowList.filter((flow) => flow.flowId !== localFlow.value.flowId)
    emit('save')
}

const replicateFlow = async () => {
    loading.value = true
    const savedFlow = await useApi().post('api/flow/clone', {
        body: {
            flowId: localFlow.value.flowId,
            appId: localFlow.value.appId
        }
    })

    if (savedFlow && savedFlow.flowId) {
        useAppStore().flowList.push(savedFlow)
        useAppStore().flow = savedFlow
    }

    emit('save')
}

onMounted(() => {
    if (props.flow && props.flow.flowId) {
        localFlow.value = cloneDeep(props.flow as Partial<FlowType>)
    } else {
        localFlow.value = {
            cron: '',
            cronStatus: 'active',
            flowKey: '',
            flowOrder: 0,
            flowStart: 0,
            locked: false,
            appId: useAppStore().app.appId,
            flowId: null,
            flowName: '',
            flowDescription: '',
            flowType: 'dataPrep',
            workflow: {
                nodes: [],
                edges: []
            },
            options: {
                flowTimeout: 0,
                dashboardType: 'page',
                flowReload: undefined,
                dialogWidth: undefined,
                dialogOnDestroy: 'none'
            },
            cronBase: {
                status: 'active',
                every: undefined,
                current: '* * * * *',
                minuteValues: [],
                hourValues: [],
                dayValues: [],
                dayOfMonthValues: [],
                monthValues: []
            }
        }
    }
})
</script>
