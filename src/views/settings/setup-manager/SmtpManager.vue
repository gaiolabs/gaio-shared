<template>
	<div
		v-if="Object.entries(smtpData).length > 0"
		class="smtp-manager"
	>
		<h2
			class="mb-3 text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight"
		>
			{{ $t('smtp') }}
		</h2>
		<div class="g-bg-1 flex flex-col gap-2 rounded p-4 shadow">
			<div class="flex gap-2">
				<div class="flex w-full flex-col">
					<label class="control-label">{{ $t('host') }}</label>
					<n-input v-model:value="smtpData.options.host" />
				</div>
				<div class="flex flex-col">
					<label class="control-label">{{ $t('port') }}</label>
					<n-input-number
						v-model:value="smtpData.options.port"
						:placeholder="$t('port')"
						min="1"
						max="100000"
						step="1"
					/>
				</div>
				<div class="flex flex-col">
					<label class="control-label">{{ $t('encryption') }}</label>
					<n-select
						v-model:value="encryption"
						:options="encryptionOptions"
					/>
				</div>
			</div>
			<div class="flex w-full flex-col">
				<label class="control-label">{{ $t('name') }}</label>
				<n-input
					v-model:value="smtpData.options.name"
					placeholder=""
				/>
			</div>
			<div class="flex gap-2">
				<div class="flex w-full flex-col">
					<label class="control-label">{{ $t('userEmail') }}</label>
					<n-input
						v-model:value="smtpData.options.user"
						placeholder=""
					/>
				</div>
				<div class="flex w-full flex-col">
					<label class="control-label">{{ $t('password') }}</label>
					<n-input
						v-model:value="smtpData.options.password"
						type="password"
					/>
				</div>
			</div>

			<div class="flex w-full flex-col">
				<n-checkbox
					v-model:checked="smtpData.options.useOffice365"
					:label="$t('office365/microsoft')"
				/>
			</div>
			<NDivider />
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<n-switch v-model:checked="smtpData.options.enabled" />
					{{ $t('enable') }}
				</div>

				<NButton
					type="primary"
					@click="saveSmtp()"
				>
					{{ $t('save') }}
				</NButton>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import useApi from '@/composables/useApi'
import type { SettingType } from '@gaio/shared/types'
import { onMounted, ref } from 'vue'
import SettingsView from '../SettingsView.vue'

const smtpData = ref<SettingType>({})

const encryption = ref('TLS')

const encryptionOptions = ref([
	{
		label: 'TLS',
		value: 'tls'
	},
	{
		label: 'SSL',
		value: 'ssl'
	}
])

const fetchSmtp = async () => {
	smtpData.value = await useApi().get('api/settings/get/smtp')

	if (!smtpData.value) {
		smtpData.value = {
			settingId: 'smtp',
			options: {
				host: '',
				port: 0,
				user: 'johndoe@example.com',
				password: '',
				enabled: false,
				useOffice365: false
			}
		}
	}
}

const saveSmtp = async () => {
	await useApi().post('api/settings/update', { body: { settingData: smtpData.value } })
}

onMounted(() => {
	fetchSmtp()
})
</script>
