<template>
	<div class="flex flex-col justify-between items-center h-full items-center justify-center overflow-hidden">
		<header class="w-full p-8">header</header>
		<main class="flex flex-col justify-center p-4 md:justify-start lg:w-[28rem]">
			<header class="flex justify-center drop-shadow-2xl">
				<div class="bg-gray-500 rounded-xl size-32 border border-carbon-200/50 dark:border-paper-100/50"></div>
			</header>
			<!-- <div class="text-1xl text-center font-bold md:text-left md:text-2xl md:leading-tight">
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
			</div> -->

			<form class="flex flex-col items-stretch pt-3 md:pt-8">
				<div class="flex flex-col pt-3">
					<label class="control-label">
						{{ $t('email') }}
					</label>
					<NInput
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
					<GPasswordInput v-model:value="credentials.password" />
					<!-- <NInput
							v-model:value="credentials.password"
							type="password"
							show-password-on="mousedown"
							:placeholder="$t('yourPassword')"
							class="mb-4 w-full bg-white"
						/> -->
				</div>
				<div class="mb-4 flex justify-between">
					<div class="">
						<NCheckbox :label="$t('rememberMe')" />
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
		</main>
		<footer class="w-full px-8 py-6 flex justify-between items-center">
			<div class=""><GPoweredBy /></div>
			<div>Problems to login?</div>
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

const gaioLogo = new URL('@/assets/images/gaio-logo.png', import.meta.url).href
const gaioLogoDark = new URL('@/assets/images/gaio-logo-dark.png', import.meta.url).href

const credentials = reactive({
	username: 'contact@gaio.io',
	password: '@Gaio123',
	loading: false,
})

const errorLogin = ref<string | null>(null)
const router = useRouter()

const handleLogin = async () => {
	credentials.loading = true

	const { token, user } = await useApi().post('api/auth/sign-in', {
		body: {
			email: credentials.username,
			password: credentials.password,
		},
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
