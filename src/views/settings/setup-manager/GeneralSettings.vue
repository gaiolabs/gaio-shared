<template>
    <div class="flex flex-col">
        <h2
            class="mb-3 text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
            {{ $t('generalSettings') }}
        </h2>
        <main class="flex flex-col gap-8">
            <div class="g-bg-1 rounded p-4 shadow">
                <h2 class="text-lg font-semibold leading-7 text-carbon-900 dark:text-paper-900">
                    {{ $t('gaioAccount') }}
                </h2>
                <p class="mt-1 text-sm leading-6 text-carbon-500 dark:text-paper-500">{{ $t('yourAccountDetails') }}</p>

                <div class="mt-4">
                    <n-table striped :bordered="true" :single-line="false">
                        <tbody>
                            <tr v-for="item in data" :key="item.key">
                                <td class="font-medium text-carbon-900 dark:text-paper-900">{{ $t(item.title) }}</td>
                                <td class="text-carbon-700 dark:text-paper-700">{{ item.value }}</td>
                            </tr>
                        </tbody>
                    </n-table>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const data = ref([
    { key: 'gaioId', title: 'gaioId', value: 'UE_XsPQleMtPlBJlyjggGdglNHrOJ' },
    { key: 'licenca', title: 'license', value: 'ckqtmd9sg0000bgu48083hfl2' },
    { key: 'email', title: 'email', value: 'contact@gaio.io' },
    { key: 'tipo', title: 'type', value: 'Enterprise' },
    { key: 'status', title: 'status', value: 'Enterprise' },
    { key: 'gpsHelpDesk', title: 'gpsHelpDesk', value: t('active') },
    { key: 'limiteUsuarios', title: 'userLimit', value: 0 },
    { key: 'backup', title: 'backup', value: t('inactive') }
])
</script>
