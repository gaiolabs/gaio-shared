<template>
    <div class="dash-menu fixed left-1 right-1 top-2 z-10 px-2">
        <div class="g-bg-1 flex items-center gap-2 rounded px-2 shadow">
            <n-button secondary size="tiny" @click="emit('close')">
                <template #icon>
                    <g-icon name="arrowLeft" />
                </template>
            </n-button>
            <n-divider vertical class="m-0 p-0" />
            <div v-if="flowList.length && activeFlow" class="flex-grow">
                <n-menu v-model:value="activeFlow" mode="horizontal" label-field="flowName" key-field="flowId"
                    :options="flowList" responsive @update:value="selectFlow" />
            </div>
            <div class="flex items-center gap-2">
                <n-divider vertical class="m-0 p-0" />
                <n-button secondary size="tiny" @click="$emit('refresh')">
                    <template #icon>
                        <g-icon name="refresh" />
                    </template>
                </n-button>
                <n-button v-if="isPreviewPage" secondary size="tiny" @click="showParameters = true">
                    <template #icon>
                        <g-icon name="params" />
                    </template>
                </n-button>
                <n-button secondary size="tiny" @click="toggleFullscreen()">
                    <template #icon>
                        <g-icon name="fullscreen" />
                    </template>
                </n-button>
            </div>
        </div>
        <dash-params v-if="isPreviewPage" :show-parameters="showParameters" @close="showParameters = false" />
    </div>
</template>
<script setup lang="ts">
import type { FlowType } from '@gaio/shared/types'
import { onMounted, ref } from 'vue'

import { useAppStore } from '@/stores'
import DashParams from '@/views/dash/DashParams.vue'

const emit = defineEmits(['choose', 'refresh', 'close'])
withDefaults(
    defineProps<{
        isPreviewPage: boolean
        flowList: FlowType[]
        toggleFullscreen: () => void
    }>(),
    {
        flowList: () => []
    }
)

const activeFlow = ref('')
const showParameters = ref(false)

const selectFlow = (flowId: string) => {
    emit('choose', flowId)
}

onMounted(() => {
    console.log(useAppStore().flow)
    activeFlow.value = useAppStore().flow.flowId
})
</script>

<style lang="scss">
.dash-menu {
    .n-menu .n-menu-item-content {
        line-height: 1;
        padding: 0.5rem 0.75rem;
    }

    .n-menu-item-content:hover {
        background: rgba(0, 0, 0, 0.071);
        color: var(--color-primary);
    }
}
</style>
