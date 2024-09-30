<template>
	<header class="flex justify-center">
		<div class="relative size-36 rounded-2xl !transition-all duration-600">
			<img
				:src="logoSrc"
				alt="Company Profile Image"
				class="g-base g-border w-full h-full object-contain object-center rounded-2xl !transition-all duration-600"
			/>
			<transition
				enter-active-class="duration-300 ease-out"
				enter-from-class="transform opacity-0 translate-y-2"
				enter-to-class="opacity-100 tralate-y-0"
				leave-active-class="duration-300 ease-out"
				leave-from-class="opacity-100 translate-y-0"
				leave-to-class="transform opacity-0 translate-y-2"
			>
				<div
					v-if="user || true"
					class="w-full absolute bottom-0 translate-y-[50%] flex justify-center !transition-all duration-600"
				>
					<div class="!transition-all g-base g-border duration-600 size-16 rounded-full overflow-hidden">
						<img
							:src="profilePicture"
							class="w-full h-full"
							onerror="this.onerror=null; this.src='/src/assets/images/gaio-default-profile.png';"
						/>
					</div>
				</div>
			</transition>
		</div>
	</header>
</template>

<script setup lang="ts">
import logoDark from '@/assets/images/gaio-mini-dark.png'
import logo from '@/assets/images/gaio-mini-light.png'
import { useAuthStore } from '@/stores'
import { useDark } from '@vueuse/core'
import { computed } from 'vue'

const user = computed(() => useAuthStore().user)

const isDark = useDark()

// TODO: load company logo via API
const logoSrc = computed(() => (isDark.value ? logoDark : logo))
const profilePicture = import.meta.env.VITE_APP_API + `api/content/user/${user.value?.userId}.png`
</script>
