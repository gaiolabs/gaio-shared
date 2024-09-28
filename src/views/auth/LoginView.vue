<template>
	<div
		id="login-view"
		class="flex relative flex-col realtive z-10 justify-between items-center h-full overflow-hidden"
	>
		<div
			:style="{ backgroundImage: `url(${bgDark})`, backgroundPosition: 'center center' }"
			class="absolute bg-cover inset-0 bg z-[-1]"
		></div>
		<div
			:style="{ backgroundImage: `url(${bg})`, backgroundPosition: 'center center' }"
			class="absolute bg-cover inset-0 bg z-[-1] dark:opacity-0 opacity-100 !duration-[600ms] !transition-all"
		></div>
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
