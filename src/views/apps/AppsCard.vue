<template>
    <g-card class="local-card g-bg-1 w-full cursor-pointer rounded-[8px] p-0">
        <div class="flex justify-between gap-2">
            <div class="flex items-start gap-1">
                <n-button
                    size="tiny"
                    secondary
                >
                    <template #icon>
                        <g-app-icon
                            :name="app.options.icon"
                            :color="app.options.color"
                        />
                    </template>
                </n-button>
                <div class="grow">
                    <div class="grow truncate text-left">
                        <div class="truncate">
                            {{ app.appName }}
                        </div>
                    </div>
                    <div class="text-gray text-[14px]">
                        <small>
                            {{ app.options.creator }}
                        </small>
                    </div>
                </div>
            </div>
            <n-button
                size="tiny"
                quaternary
                @click="useAuthStore().toggleFavoriteApp(app.appId)"
            >
                <template #icon>
                    <g-icon
                        name="star"
                        :color="generateFavorAppColor"
                    />
                </template>
            </n-button>
        </div>
        <div class="mt-5 flex items-center justify-between px-1">
            <div class="grow truncate pe-2">
                <a class="block w-full truncate text-[12px]">
                    {{ app.options.group }}
                </a>
            </div>
            <div class="flex min-w-[72px] items-center justify-end gap-2">
                <n-button
                    size="tiny"
                    text
                    @click="goTo(app, 'dashboard')"
                >
                    <template #icon>
                        <g-icon name="dashboard" />
                    </template>
                </n-button>
                <n-button
                    v-if="app.role === 'edit'"
                    size="tiny"
                    text
                    @click="$emit('edit', app)"
                >
                    <template #icon>
                        <g-icon name="pencil" />
                    </template>
                </n-button>
                <n-button
                    v-if="app.role === 'edit'"
                    size="tiny"
                    text
                    @click="goTo(app, 'studio')"
                >
                    <template #icon>
                        <g-icon name="workflow" />
                    </template>
                </n-button>
            </div>
        </div>
    </g-card>
</template>

<script setup lang="ts">
import type { AppType } from '@gaio/types'
import { cloneDeep, uniq } from 'lodash-es'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAppStore, useAuthStore } from '@/stores'

type UserAppsType = {
    role: 'view' | 'edit'
} & AppType

defineEmits(['edit'])
const props = defineProps<{ app: UserAppsType; gradient?: boolean }>()

const router = useRouter()
const currentApp = ref<Partial<AppType>>({})
const user = useAuthStore().user

const generateFavorAppColor = computed(() => {
    return user?.options?.favorApps?.includes(props.app.appId) ? '#ceb51b' : ''
})

const goTo = async (app: AppType, type: string) => {
    useAppStore().app = app
    await router.push(type).then(() => {
        updateRecentApps()
    })
}

const updateRecentApps = () => {
    user.options.recentApps.unshift(props.app.appId)

    if (user.options.recentApps.length > 4) {
        user.options.recentApps.pop()
    }

    user.options.recentApps = uniq(user.options.recentApps)

    useAuthStore().updateUserOptions(user.options)
}

onMounted(() => {
    currentApp.value = cloneDeep(props.app)
})
</script>
