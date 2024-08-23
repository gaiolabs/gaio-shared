<template>
    <div class="flex flex-col gap-2 py-3">
        <n-input-group>
            <n-input
                v-model:value="localUser.name"
                :placeholder="$t('name')"
                @blur="updateUser"
            >
                <template #prefix>
                    <g-icon name="user" />
                </template>
            </n-input>
        </n-input-group>
        <n-input
            v-model:value="localUser.email"
            :placeholder="$t('email')"
            @blur="updateUser"
        >
            <template #prefix>
                <g-icon name="email" />
            </template>
        </n-input>
        <n-select
            v-model:value="localUser.lang"
            placeholder="$t('lang')"
            :options="[
                {
                    label: $t('english'),
                    value: 'en-US'
                },
                {
                    label: $t('portuguese'),
                    value: 'pt-BR'
                },
                {
                    label: $t('spanish'),
                    value: 'es-ES'
                }
            ]"
            @update:value="updateUser"
        />

        <div class="mb-2 mt-4 grid grid-cols-2 gap-2">
            <n-button
                size="large"
                tertiary
                @click="toggleTheme('light')"
            >
                <g-icon name="sun" />
            </n-button>
            <n-button
                size="large"
                tertiary
                @click="toggleTheme('dark')"
            >
                <g-icon name="moon" />
            </n-button>
        </div>

        <n-button
            tertiary
            @click="$router.push('/login')"
        >
            {{ $t('logout') }}
        </n-button>
    </div>
</template>
<script setup lang="ts">
import type { UserType } from '@gaio/types'
import { cloneDeep } from 'lodash-es'
import { useMessage } from 'naive-ui'
import { computed, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import useApi from '@/composables/useApi'
import useValidate from '@/composables/useValidate'
import { useAuthStore } from '@/stores'

const { t } = useI18n()

const localUser = ref<UserType>()
const toast = useMessage()

const toggleTheme = (type: string) => {
    useAuthStore().user.options.userThemeMode = type
    useAuthStore().updateUserOptions(useAuthStore().user.options)
}

const updateUser = async () => {
    if (isValid.value) {
        if (localUser.value.email !== useAuthStore().user.email) {
            const data = await useApi().post('api/user/check-email', {
                body: {
                    email: localUser.value.email
                }
            })

            if (data.valid) {
                await useAuthStore().updateUserMetadata(localUser.value)
                toast.success(t('updated'))
            } else {
                toast.error(t('emailAlreadyExists'))
            }
        } else {
            await useAuthStore().updateUserMetadata(localUser.value)
            toast.success(t('updated'))
        }
    } else {
        toast.error(t('warnRequiredFields'))
    }
}

const isValid = computed(() => {
    return useValidate().isValid(localUser.value, {
        name: 'string|min:1',
        email: 'string|min:1|email',
        lang: 'string|min:1'
    })
})

onBeforeMount(() => {
    localUser.value = cloneDeep(useAuthStore().user)
})
</script>
