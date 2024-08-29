<template>
	<div class="g-bg-1 flex w-screen flex-wrap text-slate-800">
		<div class="flex w-full flex-col md:w-1/2">
			<login-credentials />
		</div>
		<div class="relative hidden h-screen select-none items-center bg-carbon-100 bg-gradient-to-br md:block md:w-1/2">
			<div class="flex h-full items-center px-8 py-16 text-white xl:w-[40rem]">
				<div>
					<span class="rounded-full bg-white px-3 py-1 font-medium text-carbon-300">New Feature</span>
					<p class="my-6 text-3xl font-semibold leading-10">
						Create dashboards faster
						<span class="abg-white whitespace-nowrap py-2 text-carbon-600">drag and drop</span>
					</p>
					<p class="mb-4">Now you can edit reports in the dashboard page</p>
					<a class="font-semibold tracking-wide text-white underline underline-offset-4">Learn More</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores'
import { onBeforeMount } from 'vue'
import LoginCredentials from './LoginCredentials.vue'

onBeforeMount(() => {
	useAuthStore().mode = 'auto'
	localStorage.clear()
})
</script>
