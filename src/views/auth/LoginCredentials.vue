<template>
	<div class="flex h-full items-center justify-center">
		<div class="mx-auto my-auto flex flex-col justify-center px-6 pt-8 md:justify-start lg:w-[28rem]">
			<div class="text-1xl text-center font-bold md:text-left md:text-2xl md:leading-tight">
				<div class="mt-1">
					<img
						v-if="isDark"
						:src="gaioLogo"
						class="mt-1 h-[50px]"
						alt="Gaio Logo"
					/>
					<img
						v-else
						class="h-[50px]"
						:src="gaioLogoDark"
						alt="Gaio Logo"
					/>
				</div>
			</div>
			<template v-if="!errorLogin">
				<form class="flex flex-col items-stretch pt-3 md:pt-8">
					<div class="flex flex-col pt-3">
						<label class="control-label">
							{{ $t('email') }}
						</label>
						<n-input
							v-model:value="credentials.username"
							class="mb-2"
							size="large"
							:placeholder="$t('yourEmail')"
						/>
					</div>
					<div class="mb-4 flex flex-col pt-2">
						<label class="control-label">
							{{ $t('password') }}
						</label>
						<n-input
							v-model:value="credentials.password"
							type="password"
							show-password-on="mousedown"
							:placeholder="$t('yourPassword')"
							class="mb-4 w-full bg-white"
						/>
					</div>
					<div class="mb-4 flex justify-between">
						<div class="">
							<n-checkbox :label="$t('rememberMe')" />
						</div>
						<div class="">
							<NButton text>Forget password</NButton>
						</div>
					</div>
					<NButton
						type="primary"
						:loading="credentials.loading"
						class="w-full"
						size="large"
						@click="handleLogin"
					>
						{{ $t('login') }}
					</NButton>
					<div class="my-3">
						<NDivider>
							{{ $t('orAccessWith').toLowerCase() }}
						</NDivider>
					</div>

					<div class="flex gap-2">
						<NButton
							size="large"
							class="grow"
						>
							{{ $t('google') }}
						</NButton>

						<NButton
							size="large"
							class="grow"
						>
							{{ $t('azureAd') }}
						</NButton>
					</div>
				</form>
			</template>
			<n-card
				v-else
				class="mb-4 w-screen max-w-[420px]"
			>
				{{ $t('errorLogin') }}
			</n-card>
		</div>
	</div>
</template>

<script setup lang="ts">
import useApi from '@/composables/useApi'
import { useAuthStore } from '@/stores'
import { useDark } from '@vueuse/core'
import { onBeforeMount, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const isDark = useDark()

const gaioLogo = new URL('@/assets/images/gaio-logo.png', import.meta.url).href
const gaioLogoDark = new URL('@/assets/images/gaio-logo-dark.png', import.meta.url).href

const credentials = reactive({
	username: 'contact@gaio.io',
	password: '@Gaio123',
	loading: false
})

const errorLogin = ref<string | null>(null)
const router = useRouter()

const handleLogin = async () => {
	credentials.loading = true

	const { token, user } = await useApi().post('api/auth/sign-in', {
		body: {
			email: credentials.username,
			password: credentials.password
		}
	})

	console.log(user)

	useAuthStore().token = token
	useAuthStore().user = user

	localStorage.setItem('gaio@token', `${token}`)
	await router.push('/apps')
}

onBeforeMount(() => {
	localStorage.removeItem('gaio@token')
})
</script>
