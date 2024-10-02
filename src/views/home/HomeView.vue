<template>
	<div
		id="home"
		class="flex h-full justify-center"
	>
		<div
			id="home-wrapper"
			class="flex size-full max-w-[1440px] flex-col justify-between overflow-auto p-2 pb-[70px]"
		>
			<div class="main px-3">
				<HomeInsights />
				<HomeViews />
				<HomeApps />
			</div>
		</div>
		<HomeNav />
	</div>
</template>

<script setup lang="ts">
import useApi from '@/composables/useApi'
import { useAuthStore } from '@/stores'
import HomeApps from '@/views/home/HomeApps.vue'
import HomeInsights from '@/views/home/HomeInsights.vue'
import HomeNav from '@/views/home/HomeNav.vue'
import HomeViews from '@/views/home/HomeViews.vue'
import { useWindowSize } from '@vueuse/core'
import { onMounted, ref, watchEffect } from 'vue'

const scrollHeight = ref({ maxHeight: '200px' })
watchEffect(() => {
	const { height } = useWindowSize()
	scrollHeight.value = { maxHeight: height + 'px' }
})

onMounted(() => {
	useApi().post('api/user/prepare', {
		body: {
			userId: useAuthStore().user?.userId,
		},
	})
})
</script>
