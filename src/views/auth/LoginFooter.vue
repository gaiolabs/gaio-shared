<template>
	<footer
		id="login-footer"
		class="w-full px-8 py-6 flex justify-between items-end"
	>
		<GPoweredBy />
		<RouterLink
			to="/auth/problems"
			class="flex group items-center gap-2 duration-150 transition-opacity opacity-70 dark:opacity-40 hover:dark:opacity-100 hover:opacity-100"
		>
			<span>{{ $t('problemsToLogin') }}</span>
			<IconComponent
				class="w-6 h-6 group-hover:-translate-y-2 transform transition-transform duration-150"
				name="ChatQuestion"
			/>
		</RouterLink>
	</footer>
</template>

<script setup lang="ts">
import GPoweredBy from '@/components/brand/GPoweredBy.vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

const { t: $t } = useI18n()
</script>
