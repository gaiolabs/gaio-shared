<template>
	<div
		id="social-login-buttons"
		class="flex gap-2 justify-center"
	>
		<!-- Google Login Button -->
		<button
			id="google-login-button"
			class="flex dark:hover:bg-gray-300/10 dark:bg-gray-300/5 dark:border-gray-300/10 shadow-none h-10 !transition-all duration-300 hover:shadow-md bg-white items-center gap-2 border-gray-300 border rounded-lg px-4"
			@click.prevent="loginWithGoogle"
		>
			<img
				class="size-5"
				src="https://authjs.dev/img/providers/google.svg"
				alt="Google Logo"
			/>
			<div class="text-center flex-1">
				<span class="opacity-80 dark:opacity-50">Sign in with Google</span>
			</div>
		</button>

		<!-- Microsoft Login Button -->
		<button
			id="microsoft-login-button"
			class="flex dark:hover:bg-white/10 dark:bg-white/5 dark:border-white/10 shadow-none !transition-all duration-300 hover:shadow-md bg-white items-center gap-2 border-gray-300 border rounded-lg px-4 h-10"
			@click.prevent="loginWithMicrosoft"
		>
			<img
				class="size-5"
				src="https://authjs.dev/img/providers/microsoft-entra-id.svg"
				alt="Microsoft Logo"
			/>
			<div class="text-center flex-1">
				<span class="opacity-80 dark:opacity-50">Microsoft Entra ID</span>
			</div>
		</button>
	</div>
</template>

<script setup lang="ts">
function loginWithGoogle() {
	alert('Google login is not implemented yet')
}

function loginWithMicrosoft() {
	alert('Microsoft login is not implemented yet')
}
</script>

<style scoped>
/* Add any specific styles here */
</style>
