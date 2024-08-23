<template>
    <div class="home flex h-full justify-center">
        <div class="home-wrapper flex size-full max-w-[1440px] flex-col justify-between overflow-auto p-2 pb-[70px]">
            <div class="main px-3">
                <home-insights />
                <home-views />
                <home-apps />
            </div>
        </div>
        <home-nav />
    </div>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { onMounted, ref, watchEffect } from 'vue'

import useApi from '@/composables/useApi'
import { useAuthStore } from '@/stores'
import HomeApps from '@/views/home/HomeApps.vue'
import HomeInsights from '@/views/home/HomeInsights.vue'
import HomeNav from '@/views/home/HomeNav.vue'
import HomeViews from '@/views/home/HomeViews.vue'

const scrollHeight = ref({ maxHeight: '200px' })
watchEffect(() => {
    const { height } = useWindowSize()
    scrollHeight.value = { maxHeight: height + 'px' }
})

onMounted(() => {
    useApi().post('api/user/prepare', {
        body: {
            userId: useAuthStore().user?.userId
        }
    })
})
</script>
