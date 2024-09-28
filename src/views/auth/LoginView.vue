<template>
	<div
		id="login-view"
		class="flex relative flex-col realtive z-10 justify-between items-center h-full overflow-hidden"
	>
		<div
			id="bg-dark"
			:style="{ backgroundImage: `url(${bgDark})`, backgroundPosition: 'center center' }"
			class="absolute bg-cover inset-0 bg z-[-1]"
		></div>
		<div
			id="bg-light"
			:style="{ backgroundImage: `url(${bg})`, backgroundPosition: 'center center' }"
			class="absolute bg-cover inset-0 bg z-[-1] dark:opacity-0 opacity-100 !duration-[600ms] !transition-all"
		></div>
		<div
			id="bg-pattern-wrapper"
			class="absolute bottom-0 left-0 translate-x-[-52%] translate-y-[58%] absolute z-[-1]"
		>
			<div
				id="bg-pattern"
				:style="{ backgroundImage: `url(${pattern})` }"
				class="dark:opacity-10 opacity-20 bg-cover w-[400vh] h-[400vh] bg"
			></div>
		</div>
		<LoginHeaderComponent />
		<main class="flex flex-col gap-6 lg:w-[28rem] pt-16">
			<CompanyLogo />
			<LoginForm />

			<div class="px-16 flex items-center justify-between gap-4">
				<div class="h-px flex-1 bg-black/10 dark:bg-white/10 transition-colors duration-[600ms]"></div>
				<small class="text-gray-500">{{ $t('orAccessWith').toLowerCase() }}</small>
				<div class="h-px flex-1 bg-black/10 dark:bg-white/10 transition-colors duration-[600ms]"></div>
			</div>
			<SocialLoginButtons />

			<!-- <NButton
				v-if="user"
				type="primary"
				size="large"
				@click="doLogout()"
			>
				{{ $t('logOut') }}
			</NButton> -->
		</main>
		<LoginFooter />
	</div>
</template>

<script setup lang="ts">
import bgDark from '@/assets/images/bg-dark.png'
import bg from '@/assets/images/bg-light.png'
import pattern from '@/assets/images/pattern.png'
import { useAuthStore } from '@/stores'
import { useDark } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import CompanyLogo from './CompanyLogo.vue'
import LoginFooter from './LoginFooter.vue'
import LoginForm from './LoginForm.vue'
import LoginHeaderComponent from './LoginHeader.vue'
import SocialLoginButtons from './SocialLoginButtons.vue'
const { t: $t } = useI18n()
const user = computed(() => useAuthStore().user)
const isDark = useDark()

function doLogout() {
	useAuthStore().logout()
}
</script>

<style scoped>
#bg-pattern {
	animation: spin calc(15 * 60 * 1s) infinite;
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>
