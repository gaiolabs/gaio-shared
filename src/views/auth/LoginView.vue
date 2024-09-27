<template>
	<div
		id="login-view"
		class="flex relative flex-col justify-between items-center h-full items-center justify-center overflow-hidden"
	>
		<header class="w-full px-8 py-6 justify-between flex">
			<div>&nbsp;</div>
			<div
				class="dark:opacity-15 opacity-50 cursor-default dark:hover:opacity-100 hover:opacity-100 gap-1 duration-150 transition-opacity flex flex-col items-end"
			>
				<div class="flex items-center gap-1">
					<IconComponent
						name="Calendar"
						class="pb-px"
					/>
					{{ calendar() }}
				</div>
				<div class="flex items-center gap-1">
					<IconComponent
						name="Clock"
						class="pb-px"
					/>
					{{ time() }}
				</div>
			</div>
		</header>
		<main class="flex flex-col gap-6 lg:w-[28rem] pt-16">
			<header class="flex justify-center">
				<div
					class="bg-gray-300/[2.5%] size-36 rounded-2xl border border-gray-300 dark:border-gray-300/10 overflow-hidden"
				>
					<img
						:src="isDark ? '/profile-company-dark.png' : '/profile-company-light.png'"
						alt="Company Profile Image"
						class="w-full h-full object-contain object-center"
					/>
				</div>
			</header>

			<form
				class="flex flex-col items-stretch gap-4"
				@submit.prevent="handleLogin"
			>
				<label>
					<span :class="{ 'dark:text-red-400 text-red-600': credentials.hasError }">
						{{ $t('email') }}
					</span>
					<NInput
						ref="usernameRef"
						v-model:value="credentials.username"
						size="large"
						:status="credentials.hasError ? 'error' : ''"
						:placeholder="$t('yourEmail')"
					/>
				</label>

				<label>
					<span :class="{ 'dark:text-red-400 text-red-600': credentials.hasError }">
						{{ $t('password') }}
					</span>
					<GPasswordInput
						v-model:value="credentials.password"
						:status="credentials.hasError ? 'error' : ''"
						size="large"
					/>
				</label>
				<!-- <div class="mb-4 flex justify-between">
					<div class="">
						<NCheckbox :label="$t('rememberMe')" />
					</div>
					<div class="">
						<NButton text>Forget password</NButton>
					</div>
				</div> -->
				<div class="flex flex-col mt-8">
					<div
						class="g-gradient-border group filter hover:brightness-105 hover:contrast-[1.05] transition-all duration-150 p-px rounded-md"
					>
						<button
							ref="submitRef"
							type="submit"
							rel="noopener noreferrer"
							class="w-full flex items-center justify-center gap-2 g-gradient px-4 rounded-[4px] py-[10px] text-white font-medium"
							:disabled="credentials.loading"
						>
							<div
								class="filter"
								style="--tw-drop-shadow: drop-shadow(1px 1px 0px rgb(0 0 0 / 0.5))"
							>
								<IconComponent
									v-show="credentials.loading"
									name="Loader"
									strokewidth="2.0"
									class="w-5 h-5 -ml-7 opacity-80"
								/>
							</div>
							<span
								style="--tw-drop-shadow: drop-shadow(1px 1px 0px rgb(0 0 0 / 0.3))"
								class="filter"
							>
								Login
							</span>
						</button>
					</div>
				</div>
				<n-collapse-transition :show="credentials.hasError">
					<n-alert type="error">
						{{ $t('invalidCredentials') }}
					</n-alert>
				</n-collapse-transition>
				<div class="px-16">
					<NDivider class="!text-sm">
						{{ $t('orAccessWith').toLowerCase() }}
					</NDivider>
				</div>

				<div class="flex gap-2 justify-center">
					<button
						class="flex dark:hover:bg-gray-300/10 dark:bg-gray-300/5 dark:border-gray-300/10 shadow-none h-10 transition-all duration-300 hover:shadow-md bg-white items-center gap-2 border-gray-300 border rounded-lg px-4"
						@click.prevent="loginWithGoogle"
					>
						<img
							class="size-5"
							src="https://authjs.dev/img/providers/google.svg"
							alt=""
						/>

						<div class="text-center flex-1">
							<span class="opacity-80 dark:opacity-50">Sign in with Google</span>
						</div>
					</button>

					<button
						class="flex dark:hover:bg-white/10 dark:bg-white/5 dark:border-white/10 shadow-none transition-all duration-300 hover:shadow-md bg-white items-center gap-2 border-gray-300 border rounded-lg px-4 h-10"
						@click.prevent="loginWithMicrosoft"
					>
						<img
							class="size-5"
							src="https://authjs.dev/img/providers/microsoft-entra-id.svg"
							alt=""
						/>

						<div class="text-center flex-1">
							<span class="opacity-80 dark:opacity-50">Microsoft Entra ID</span>
						</div>
					</button>
				</div>
			</form>
		</main>
		<footer class="w-full px-8 py-6 flex justify-between items-end">
			<div class=""><GPoweredBy /></div>
			<RouterLink
				to="/auth/problems"
				class="flex group items-center gap-2 text-gray-400 dark:text-gray-600 hover:dark:text-gray-500 hover:text-gray-600 transition-colors duration-150"
			>
				<span>Problems to login?</span>
				<IconComponent
					class="w-6 h-6 group-hover:-translate-y-2 transform transition-transform duration-150"
					name="ChatQuestion"
				/>
			</RouterLink>
		</footer>
	</div>
</template>

<script setup lang="ts">
import GPoweredBy from '@/components/brand/GPoweredBy.vue'
import GPasswordInput from '@/components/inputs/GPasswordInput.vue'
import useApi from '@/composables/useApi'
import { useAuthStore } from '@/stores'
import { useDark } from '@vueuse/core'
import { onBeforeMount, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const isDark = useDark()

// const gaioLogo = new URL('@/assets/images/gaio-logo.png', import.meta.url).href
// const gaioLogoDark = new URL('@/assets/images/gaio-logo-dark.png', import.meta.url).href

const credentials = reactive({
	username: 'contact@gaio.io',
	password: '@Gaio123',
	loading: false,
	hasError: false,
})

// watch credentials.username and password to reset hasError
watch([() => credentials.username, () => credentials.password], () => (credentials.hasError = false))

const router = useRouter()

const usernameRef = ref<HTMLInputElement | null>(null)
const submitRef = ref<HTMLInputElement | null>(null)

const handleLogin = async () => {
	credentials.loading = true
	credentials.hasError = false
	submitRef.value?.focus()
	await new Promise((resolve) => setTimeout(resolve, 1000))

	try {
		const { token, user } = await useApi().post('api/auth/sign-in', {
			body: {
				email: credentials.username,
				password: credentials.password,
			},
		})

		useAuthStore().token = token
		useAuthStore().user = user

		localStorage.setItem('gaio@token', `${token}`)
		await router.push('/apps')
	} catch (error) {
		console.warn(error)
		credentials.hasError = true
		// focus on the first input
		nextTick(() => {
			usernameRef.value?.focus()
		})
	}
	credentials.loading = false
}

function loginWithMicrosoft() {
	alert('Not implemented yet')
}

function loginWithGoogle() {
	alert('Not implemented yet')
}

onBeforeMount(() => {
	localStorage.removeItem('gaio@token')
})

// live clock separated by date and time
const locale = 'en-US'
const now = ref(new Date())

function calendar() {
	const intl = new Intl.DateTimeFormat(locale, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})

	return intl.format(now.value)
}

function time() {
	const intl = new Intl.DateTimeFormat(locale, {
		hour: 'numeric',
		minute: 'numeric',
	})

	return intl.format(now.value)
}

const clockInterval = setInterval(() => {
	now.value = new Date()
}, 1000)

onBeforeUnmount(() => {
	clearInterval(clockInterval)
})
</script>
