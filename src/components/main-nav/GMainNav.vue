<template>
	<div
		id="home-nav-wrapper"
		class="absolute bottom-0 m-0 flex w-full justify-center text-center select-none print:hidden"
	>
		<div
			id="home-nav-inner"
			class="w-full flex flex-row justify-center p-0 overflow-hidden sm:p-4 items-center"
		>
			<div class="hidden md:flex w-1/4 flex justify-end">
				<LeftNav />
			</div>
			<div class="w-full sm:flex md:max-w-sm sm:justify-center">
				<CenterNav @toggle-app-control="toggleAppControl" />
			</div>
			<div class="hidden md:flex w-1/4 flex justify-start"><RightNav /></div>
		</div>
		<AppControl
			v-if="showAppControl"
			@close="showAppControl = false"
		/>
	</div>
</template>

<script setup lang="ts">
import AppControl from '@/views/apps/AppControl.vue'
import { ref } from 'vue'
import CenterNav from './CenterNav.vue'
import LeftNav from './LeftNav.vue'
import RightNav from './RightNav.vue'

const showAppControl = ref(false)

const toggleAppControl = () => {
	showAppControl.value = !showAppControl.value
}
</script>
