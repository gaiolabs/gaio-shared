<template>
    <div
        v-if="localApp && localApp.options"
        class="app-control-general"
    >
        <div
            v-if="localApp.options"
            class="app-control bg-elevation-1 p-3 px-4"
        >
            <div class="grid grid-cols-2 gap-2">
                <div>
                    <div>{{ $t('name') }}</div>
                    <n-input v-model:value="localApp.appName" />
                </div>
                <div>
                    <div>{{ $t('description') }}</div>
                    <n-input v-model:value="localApp.appDescription" />
                </div>
            </div>
            <div class="mt-2">
                <div>{{ $t('repository') }}</div>
                <n-select
                    v-model:value="localApp.repoId"
                    :disabled="!!localApp.appId"
                    :options="repoList"
                />
            </div>
            <div class="mt-2 flex gap-2">
                <div class="grow">
                    <div>{{ $t('creator') }}</div>
                    <n-input v-model:value="localApp.options.creator" />
                </div>
                <div class="grow">
                    <div>{{ $t('group') }}</div>
                    <n-input v-model:value="localApp.options.group" />
                </div>
                <div class="w-[70px]">
                    <div>{{ $t('color') }}</div>
                    <n-color-picker
                        v-model:value="localApp.options.color"
                        :render-label="() => ''"
                        :modes="['hex']"
                    />
                </div>
                <div class="w-[55px]">
                    <div>{{ $t('icon') }}</div>
                    <n-button
                        type="primary"
                        @click="showIconControl = true"
                    >
                        <template #icon>
                            <g-app-icon :name="localApp.options.icon" />
                        </template>
                    </n-button>
                </div>
            </div>
            <div class="mt-2">
                {{ $t('dashboardLink') }}
                <n-list
                    v-if="localApp.appToken"
                    size="small"
                    bordered
                >
                    <n-list-item>
                        {{ appUrl }}
                    </n-list-item>
                </n-list>
            </div>
        </div>

        <g-icon-finder
            v-if="showIconControl"
            @close="showIconControl = false"
            @choose="localApp.options.icon = $event"
        />
    </div>
</template>

<script setup lang="ts">
import useApi from '@/composables/useApi'
import { ref, onMounted, computed } from 'vue'
import type { AppType } from '@gaio/types'

const props = withDefaults(
    defineProps<{
        localApp: AppType
    }>(),
    {
        localApp: null
    }
)

const repoList = ref<{ label: string; value: string }[]>([])
const showIconControl = ref(false)

const appUrl = computed(() => {
    return `${window.location.origin}/app/${props.localApp.appToken}`
})

const loadRepository = async () => {
    repoList.value = await useApi()
        .get('api/repo/list')
        .then((res) => {
            return res.map((repo) => {
                return {
                    label: repo.repoName,
                    value: repo.repoId
                }
            })
        })
}

onMounted(() => {
    loadRepository()
})
</script>
