<template>
	<div
		id="login-view"
		class="flex relative flex-col realtive z-10 justify-between items-center h-full overflow-hidden"
	>
		<BackgroundElements />
		<LoginHeaderComponent />
		<main class="flex flex-col gap-6 lg:w-[28rem] pt-16">
			<CompanyLogo />
			<LoginForm />
		</main>
		<LoginFooter />
	</div>
</template>

<script setup lang="ts">
import BackgroundElements from './BackgroundElements.vue'
import CompanyLogo from './CompanyLogo.vue'
import LoginFooter from './LoginFooter.vue'
import LoginForm from './LoginForm.vue'
import LoginHeaderComponent from './LoginHeader.vue'
const user = computed(() => useAuthStore().user)

function doLogout() {
	useAuthStore().logout()
}
</script>
