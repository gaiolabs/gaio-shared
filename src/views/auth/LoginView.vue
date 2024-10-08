<template>
	<div
		id="login-view"
		class="flex relative flex-col realtive z-10 justify-between items-center h-full overflow-hidden"
	>
		<LoginHeaderComponent />

		<main class="flex flex-col gap-6 lg:w-[28rem] px-4 lg:px-0 pt-4 lg:pt-16">
			<CompanyLogo />
			<LoginForm />
		</main>

		<LoginFooter />
	</div>
</template>

<script setup lang="ts">
import CompanyLogo from './CompanyLogo.vue'
import LoginFooter from './LoginFooter.vue'
import LoginForm from './LoginForm.vue'
import LoginHeaderComponent from './LoginHeader.vue'
</script>
