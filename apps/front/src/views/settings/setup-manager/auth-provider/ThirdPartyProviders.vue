<template>
    <div class="g-bg-1 rounded p-4 shadow">
        <h2 class="text-lg font-semibold text-carbon-900 dark:text-paper-900">
            {{ $t('thirdPartyProviders') }}
        </h2>
        <p class="mt-1 text-sm text-carbon-500 dark:text-paper-500">
            {{ $t('thirdPartyProvidersDescription') }}
        </p>

        <ul
            role="list"
            class="mt-6 divide-y divide-paper-400 border-t border-paper-400 px-4 dark:divide-carbon-500 dark:border-carbon-800"
        >
            <li
                v-for="provider in thirdPartyProviders"
                :key="provider.name"
                class="flex justify-between gap-x-6 py-6"
            >
                <n-collapse arrow-placement="right">
                    <n-collapse-item>
                        <template #header>
                            <img
                                class="mr-2 h-4 w-4"
                                :src="provider.logo"
                                alt=""
                            />
                            <div class="w-full font-medium">
                                {{ provider.name }}
                            </div>
                        </template>
                        <n-form class="mt-4 flex flex-col">
                            <n-form-item
                                label="Client ID"
                                class="w-full"
                            >
                                <n-input
                                    v-model:value="provider.credentials.clientId"
                                    size="large"
                                    :placeholder="$t('your' + provider.name + 'ClientId')"
                                    clearable
                                    @blur="updateThirdPartyProviders(provider.key)"
                                />
                            </n-form-item>
                            <n-form-item
                                label="Client Secret"
                                class="w-full"
                            >
                                <n-input
                                    v-model:value="provider.credentials.clientSecret"
                                    size="large"
                                    :placeholder="$t('your' + provider.name + 'ClientSecret')"
                                    clearable
                                    @blur="updateThirdPartyProviders(provider.key)"
                                />
                            </n-form-item>
                            <n-form-item
                                v-if="Object.keys(provider.credentials).includes('tenantId')"
                                label="Tenant ID"
                                class="w-full"
                            >
                                <n-input
                                    v-model:value="provider.credentials.tenantId"
                                    size="large"
                                    :placeholder="$t('your' + provider.name + 'TenantId')"
                                    clearable
                                    @blur="updateThirdPartyProviders(provider.key)"
                                />
                            </n-form-item>
                        </n-form>
                    </n-collapse-item>
                </n-collapse>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import useApi from '@/composables/useApi'

const thirdPartyProviders = ref([
    {
        name: 'Google',
        key: 'providerGoogle',
        enabled: true,
        logo: 'https://authjs.dev/img/providers/google.svg',
        credentials: {
            clientId: '123456789********************************************content.com',
            clientSecret: 'abc123*************************************************def456'
        }
    },
    {
        name: 'Microsoft Entra ID',
        key: 'providerMicrosoftEntraId',
        enabled: true,
        logo: 'https://authjs.dev/img/providers/microsoft-entra-id.svg',
        credentials: {
            clientId: '123456789********************************************content.com',
            clientSecret: 'abc123*************************************************def456',
            tenantId: '123456789********************************************content.com'
        }
    }
])
onMounted(async () => {
    for (const provider of thirdPartyProviders.value) {
        const data = await useApi().get('api/settings/get/' + provider.key)
        if (data) {
            provider.credentials = data.options
        }
    }
})

const updateThirdPartyProviders = (key: string) => {
    // get otbject by key
    const provider = thirdPartyProviders.value.find((provider) => provider.key === key)
    if (!provider) return
    useApi().post('api/settings/update', {
        body: {
            settingData: {
                settingId: key,
                options: provider.credentials
            }
        }
    })
}
</script>
