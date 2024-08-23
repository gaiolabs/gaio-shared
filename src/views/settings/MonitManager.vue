<template>
    <settings-view>
        <template #title>
            <div class="flex items-center gap-2">
                <g-icon
                    name="monit"
                    :height="22"
                />
                {{ $t('monit') }}
            </div>
        </template>
        <div>
            <n-space vertical>
                <n-divider title-placement="left">
                    {{ $t('Todo') }}
                </n-divider>
                <n-skeleton
                    :height="30"
                    class="rounded"
                />
                <n-skeleton
                    :height="90"
                    class="rounded"
                />
            </n-space>
        </div>
    </settings-view>
</template>
<script setup lang="ts">
import SettingsView from '@/views/settings/SettingsView.vue'
</script>
