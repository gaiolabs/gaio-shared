<template>
    <div
        v-if="localApp"
        class="app-control-flow px-4"
    >
        <div class="my-2">
            <div>{{ $t('firstFlowAtStudio') }}</div>
            <n-select
                v-model:value="localApp.options.studioFlowStart"
                :options="flowList"
            />
        </div>

        <div
            v-if="!loading && flowList.length"
            class="mb-2"
        >
            <div>
                {{ $t('dashboard') }}
            </div>

            <div>
                <n-list
                    size="small"
                    bordered
                >
                    <drag
                        :list="flowList"
                        @change="updateFlowOrder"
                    >
                        <n-list-item
                            v-for="flow of flowList"
                            :key="flow.value"
                        >
                            <div class="flex items-center gap-2">
                                <div>
                                    <g-icon
                                        v-if="flow.flowType === 'infoPub'"
                                        name="dashboard"
                                    />
                                    <g-icon
                                        v-else
                                        name="dashboard"
                                    />
                                </div>
                                <div>{{ flow.label }} - {{ flow.value }}</div>
                            </div>
                        </n-list-item>
                    </drag>
                </n-list>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { AppType, FlowType } from '@gaio/types'
import { onMounted, ref } from 'vue'
import { VueDraggableNext as Drag } from 'vue-draggable-next'

import useApi from '@/composables/useApi'

const props = withDefaults(defineProps<{ localApp: AppType }>(), {
    localApp: null
})

const loading = ref(false)

const flowList = ref<{ label: string; value: string; [key: string]: unknown }[]>([])

const loadFlow = async () => {
    loading.value = true
    const { post } = useApi()
    flowList.value = await post('api/flow/list', {
        body: {
            appId: props.localApp.appId
        }
    }).then((res: FlowType[]) =>
        res.map((item) => ({
            label: item.flowName,
            value: item.flowId,
            flowType: item.flowType
        }))
    )
    loading.value = false
}

const updateFlowOrder = () => {
    useApi().post('api/flow/update-order', {
        body: {
            appId: props.localApp.appId,
            flowList: flowList.value.map((item) => item.value)
        }
    })
}

onMounted(() => {
    loadFlow()
})
</script>
