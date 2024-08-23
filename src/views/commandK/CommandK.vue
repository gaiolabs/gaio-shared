<template>
    <n-modal
        ref="commandKRef"
        v-model:show="showModal"
        destroy-on-close
        :mask-closable="false"
        @esc="closeModal"
        @close="closeModal"
    >
        <div class="command-k-body cp-body active flex justify-center">
            <div class="command-k-wrapper flex h-full max-h-[720px] w-[1200px] justify-center">
                <div
                    class="command-k-inner flex h-[670px] min-h-[436px] w-full flex-col overflow-hidden rounded-[8px] border-elevation-2 bg-paper-100 shadow-lg dark:bg-carbon-200"
                >
                    <command-k-tabs />
                    <div class="command-k-content grow border-t">
                        <command-k-all
                            v-if="['table', 'flow', 'all'].includes(useCommandKStore().tab)"
                            @close="closeModal"
                        />
                        <command-power v-if="useCommandKStore().tab === 'power'" />
                        <command-insights v-else-if="useCommandKStore().tab === 'insights'" />
                    </div>
                </div>
            </div>
        </div>
    </n-modal>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import { useCommandKStore } from '@/stores'
import CommandInsights from '@/views/commandK/command-insights/CommandInsights.vue'
import CommandPower from '@/views/commandK/command-power/CommandPower.vue'
import CommandKAll from '@/views/commandK/CommandKAll.vue'
import CommandKTabs from '@/views/commandK/CommandKTabs.vue'

const emit = defineEmits(['close'])

const showModal = ref(true)
const closeModal = () => {
    showModal.value = false
    emit('close')
}
</script>
