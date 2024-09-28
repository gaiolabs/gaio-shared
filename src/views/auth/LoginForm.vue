<template>
	<form
		id="login-form"
		class="flex flex-col items-stretch gap-4"
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
			class="g-gradient-border group filter hover:brightness-105 hover:contrast-[1.05] transition-all duration-150 p-px rounded-md"
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
		<n-collapse-transition :show="credentials.hasError">
			<n-alert
				id="login-error"
				type="error"
			>
				{{ $t('invalidCredentials') }}
			</n-alert>
		</n-collapse-transition>
	</form>
</template>

<script setup lang="ts">
import GPasswordInput from '@/components/inputs/GPasswordInput.vue'
import useApi from '@/composables/useApi'
import { useAuthStore } from '@/stores'
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

const doLogin = async () => {
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
		await router.push('/apps')
	} catch (error) {
		console.warn('⚠️ - Login error: ', error)
		credentials.hasError = true

		nextTick(() => {
			usernameRef.value?.focus()
		})
	}
	credentials.loading = false
}
</script>
