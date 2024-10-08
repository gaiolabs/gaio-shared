<template>
	<NCollapseTransition :show="mode === 'login'">
		<form
			id="login-form"
			class="flex flex-col items-stretch gap-4 w-full min-w-[300px]"
			@submit.prevent="doLogin"
		>
			<!-- Email Input -->
			<label id="email">
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

			<!-- Password Input -->
			<label id="password">
				<span :class="{ 'dark:text-red-400 text-red-600': credentials.hasError }">
					{{ $t('password') }}
				</span>
				<GPasswordInput
					v-model:value="credentials.password"
					:status="credentials.hasError ? 'error' : ''"
					size="large"
				/>
			</label>

			<!-- Submit Button -->
			<div
				id="login-button-wrapper"
				class="g-gradient-border group mt-8 filter hover:brightness-105 hover:contrast-[1.05] transition-all duration-150 p-px rounded-md"
			>
				<button
					id="login-button"
					ref="submitRef"
					type="submit"
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
						{{ $t('login') }}
					</span>
				</button>
			</div>

			<!-- Error Alert -->
			<NCollapseTransition :show="credentials.hasError">
				<n-alert
					id="login-error"
					type="error"
				>
					{{ $t('invalidCredentials') }}
				</n-alert>
			</NCollapseTransition>
		</form>
		<footer class="flex flex-col gap-6 mt-6">
			<GHorizontalDivider />
			<SocialLoginButtons />
		</footer>
	</NCollapseTransition>
	<NCollapseTransition :show="mode === 'alreadyLoggedIn'">
		<main class="flex flex-col gap-6 mt-6">
			<NButton
				id="register-button"
				size="large"
				type="secondary"
				class="!mt-4"
			>
				{{ $t('loginBackToGaio') }}
			</NButton>
			<NButton
				id="register-button"
				size="large"
				type="link"
				@click="doLogout"
			>
				{{ $t('anotherAccount') }}
			</NButton>
		</main>
	</NCollapseTransition>

	<main
		v-if="mode === 'welcome'"
		class="flex flex-col items-center gap-6 mt-12 mb-6"
	>
		<div class="text-center text-3xl">
			{{ $t('welcome') }}
			<span class="font-bold">{{ user.name }}</span>
			<span>!</span>
		</div>
		<div>
			<IconComponent
				name="Loader"
				class="size-8 opacity-20"
			/>
		</div>
	</main>
</template>

<script setup lang="ts">
import GPasswordInput from '@/components/inputs/GPasswordInput.vue'
import useApi from '@/composables/useApi'
import { useAuthStore } from '@/stores'
import GHorizontalDivider from '@/views/auth/GHorizontalDivider.vue'
import SocialLoginButtons from '@/views/auth/SocialLoginButtons.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t: $t } = useI18n()

const credentials = reactive({
	username: 'contact@gaio.io',
	password: '@Gaio123',
	loading: false,
	hasError: false,
})

watch([() => credentials.username, () => credentials.password], () => (credentials.hasError = false))

const usernameRef = ref(null)
const submitRef = ref(null)
const router = useRouter()
const user = computed(() => useAuthStore().user)

const mode = ref('login')

// watch mode, if its welcome wait 2 seconds and redirect to /apps
watch(mode, async () => {
	if (mode.value === 'welcome') {
		await new Promise((resolve) => setTimeout(resolve, 2000))
		await router.push('/apps')
	}
})

async function doLogin() {
	credentials.loading = true
	credentials.hasError = false
	nextTick(() => {
		submitRef.value?.focus()
	})
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
		mode.value = ''
		await new Promise((resolve) => setTimeout(resolve, 300))
		mode.value = 'welcome'
		// await router.push('/apps')
	} catch (error) {
		console.warn('⚠️ - Login error: ', error)
		credentials.hasError = true

		nextTick(() => {
			usernameRef.value?.focus()
		})
	}
	credentials.loading = false
}

function doLogout() {
	useAuthStore().logout()
}
</script>
