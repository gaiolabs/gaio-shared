<template>
    <settings-view>
        <template #title>
            <div class="flex items-center gap-2">
                <g-icon
                    name="setupSettings"
                    :height="22"
                />
                {{ $t('setup') }}
            </div>
        </template>
        <div class="flex">
            <aside class="w-full max-w-sm pt-2">
                <n-menu
                    v-model:value="activeKey"
                    :options="menuOptions"
                />
            </aside>
            <div class="flex-1 p-2">
                <general-settings v-if="activeKey === 'general'" />
                <white-label v-else-if="activeKey === 'white-label'" />
                <auth-provider v-else-if="activeKey === 'auth-providers'" />
                <smtp-manager v-else-if="activeKey === 'smtp'" />
            </div>
        </div>
    </settings-view>
</template>

<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import SettingsView from '@/views/settings/SettingsView.vue'
import AuthProvider from '@/views/settings/setup-manager/auth-provider/AuthProvider.vue'
import GeneralSettings from '@/views/settings/setup-manager/GeneralSettings.vue'
import SmtpManager from '@/views/settings/setup-manager/SmtpManager.vue'
import WhiteLabel from '@/views/settings/setup-manager/WhiteLabel.vue'

const activeKey = ref('general')
const { t } = useI18n()
const menuOptions: MenuOption[] = [
    {
        label: t('general'),
        key: 'general'
    },
    {
        label: 'White Label',
        key: 'white-label'
    },
    {
        label: 'Auth Providers',
        key: 'auth-providers'
    },
    {
        label: 'SMTP',
        key: 'smtp'
    }
]
</script>
