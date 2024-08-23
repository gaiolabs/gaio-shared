<template>
    <div class="flex flex-col">
        <h2
            class="mb-3 text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight"
        >
            {{ $t('authProviders') }}
        </h2>
        <main class="flex flex-col gap-8">
            <div class="g-bg-1 rounded p-4 shadow">
                <h2 class="text-lg font-semibold leading-7 text-carbon-900 dark:text-paper-900">
                    {{ $t('default') }}
                </h2>
                <p class="mt-1 text-sm leading-6 text-carbon-500 dark:text-paper-500">
                    {{ $t('settingsDefaultDescription') }}
                </p>

                <dl
                    class="mt-6 divide-y divide-paper-400 border-t border-paper-400 px-4 dark:divide-carbon-500 dark:border-carbon-800"
                >
                    <!-- 2FA -->
                    <div class="flex items-center py-4">
                        <dt class="font-medium text-carbon-900 dark:text-paper-900 sm:w-64 sm:flex-none sm:pr-6">
                            2FA
                        </dt>
                        <dd class="mt-1 flex items-center justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                            <div class="flex flex-col text-carbon-700 dark:text-paper-700">
                                {{ $t('twoFactorAuthenticator') }}
                                <small>{{ $t('twoFactorAuthenticatorDescription') }}</small>
                            </div>

                            <n-switch
                                v-model:value="providerDefault.twoFactorAuthenticator"
                                @update:value="updateProviderDefault"
                            />
                        </dd>
                    </div>

                    <!-- Session Timeout -->
                    <div class="flex items-center py-6">
                        <dt class="font-medium text-carbon-900 dark:text-paper-900 sm:w-64 sm:flex-none sm:pr-6">
                            {{ $t('sessionTimeout') }}
                        </dt>
                        <dd class="mt-1 flex items-center justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                            <div class="flex flex-col text-carbon-700 dark:text-paper-700">
                                <small>{{ $t('sessionTimeoutDescription') }}</small>
                            </div>
                            <div class="flex gap-2">
                                <n-input-number
                                    v-model:value="providerDefault.sessionTimeout"
                                    class="text-center"
                                    button-placement="both"
                                    @update:value="updateProviderDefault"
                                />
                                <n-select
                                    v-model:value="providerDefault.sessionTimeoutUnit"
                                    :options="timeoutOptions"
                                    @update:value="updateProviderDefault"
                                />
                            </div>
                        </dd>
                    </div>

                    <!-- User Access Control -->
                    <!-- <div class="flex items-center py-4">
                        <dt class="font-medium text-carbon-900 dark:text-paper-900 sm:w-64 sm:flex-none sm:pr-6">
                            {{ $t('userAccessControl') }}
                        </dt>
                        <dd class="mt-1 flex items-center justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                            <div class="flex flex-col text-carbon-700 dark:text-paper-700">
                                {{ $t('userAccessControlDescription') }}
                            </div>

                            <n-switch v-model:value="userAccessControlEnabled" />
                        </dd>
                    </div> -->

                    <!-- Conventional Sign-In -->
                    <div class="flex items-center py-4">
                        <dt class="font-medium text-carbon-900 dark:text-paper-900 sm:w-64 sm:flex-none sm:pr-6">
                            {{ $t('conventionalSignIn') }}
                        </dt>
                        <dd class="mt-1 flex items-center justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                            <div class="flex flex-col text-carbon-700 dark:text-paper-700">
                                {{ $t('conventionalSignInDescription') }}
                            </div>

                            <n-switch
                                v-model:value="providerDefault.conventionalSignIn"
                                @update:value="updateProviderDefault"
                            />
                        </dd>
                    </div>
                </dl>
            </div>

            <ThirdPartyProviders />
        </main>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import useApi from '@/composables/useApi'
import ThirdPartyProviders from '@/views/settings/setup-manager/auth-provider/ThirdPartyProviders.vue'

const providerDefault = ref({
    twoFactorAuthenticator: false,
    sessionTimeout: 0,
    sessionTimeoutUnit: 'minutes',
    conventionalSignIn: false
})
onMounted(async () => {
    const data = await useApi().get('api/settings/get/providerDefault')
    if (data) {
        providerDefault.value = {
            twoFactorAuthenticator: !!data.options.twoFactorAuthenticator,
            sessionTimeout: data.options.sessionTimeout,
            sessionTimeoutUnit: data.options.sessionTimeoutUnit,
            conventionalSignIn: !!data.options.conventionalSignIn
        }
    }
})
const updateProviderDefault = () => {
    useApi().post('api/settings/update', {
        body: {
            settingData: {
                settingId: 'providerDefault',
                options: providerDefault.value
            }
        }
    })
}

const timeoutOptions = [
    { value: 'minutes', label: 'Minutes' },
    { value: 'hours', label: 'Hours' },
    { value: 'days', label: 'Days' }
]
</script>
