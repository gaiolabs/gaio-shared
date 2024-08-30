<template>
	<div class="home-account-password pt-3">
		<div class="control">
			<div class="control-label">
				{{ $t('current') }}
			</div>
			<NInput
				v-model:value="localAuth.currentPassword"
				type="password"
				:placeholder="$t('password')"
			/>
		</div>
		<div class="control">
			<div class="control-label">
				{{ $t('newPassword') }}
			</div>
			<NInput
				v-model:value="localAuth.newPassword"
				type="password"
				:placeholder="$t('password')"
			/>
		</div>
		<div class="control">
			<div class="control-label">
				{{ $t('repeatPassword') }}
			</div>
			<NInput
				v-model:value="localAuth.repeatPassword"
				type="password"
				:placeholder="$t('password')"
			/>
		</div>
		<div class="control">
			<NButton
				block
				type="primary"
				:loading="loading"
				:disabled="!isValid"
				@click="updatePassword"
			>
				{{ $t('update') }}
			</NButton>
		</div>
	</div>
</template>
<script setup lang="ts">
import useApi from '@/composables/useApi'
import useValidate from '@/composables/useValidate'
import { useMessage } from 'naive-ui'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const toast = useMessage()
const loading = ref(false)
const { t } = useI18n()

const updatePassword = async () => {
	loading.value = true

	const result = await useApi().post('api/user/update-password', {
		body: {
			passwordData: localAuth.value
		}
	})
	loading.value = false

	if (result.status === 'fail') {
		toast.error(t(result.message))
	} else {
		toast.success(t('success'))
	}
}

const localAuth = ref({
	currentPassword: '',
	newPassword: '',
	repeatPassword: ''
})

const isValid = computed(() => {
	return useValidate().isValid(localAuth.value, {
		currentPassword: 'string|min:4',
		newPassword: 'string|min:4',
		repeatPassword: { type: 'equal', field: 'newPassword' }
	})
})
</script>
