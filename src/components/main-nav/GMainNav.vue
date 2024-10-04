<template>
	<div
		id="home-nav-wrapper"
		class="absolute bottom-0 m-0 flex w-full justify-center text-center"
	>
		<div
			id="home-nav-inner"
			class="w-full max-w-[1440px] gap-16 flex flex-row justify-center p-4 items-center"
		>
			<LeftNav />
			<CenterNav @toggle-app-control="toggleAppControl" />
			<RightNav />
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
