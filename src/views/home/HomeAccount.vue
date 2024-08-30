<template>
	<div class="home-account min-h-[246px] min-w-[300px] pt-1">
		<NTabs
			type="segment"
			animated
			size="small"
		>
			<NTabPane
				name="account"
				:tab="$t('account')"
			>
				<home-account-profile />
			</NTabPane>
			<NTabPane
				name="password"
				:tab="$t('password')"
			>
				<home-account-password />
			</NTabPane>
		</NTabs>
	</div>
</template>
<script setup lang="ts">
import HomeAccountPassword from '@/views/home/HomeAccountPassword.vue'
import HomeAccountProfile from '@/views/home/HomeAccountProfile.vue'
</script>
