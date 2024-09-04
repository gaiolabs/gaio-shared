<template>
	<div
		class="g-id g-bg-300 flex w-[80px] items-center rounded p-1 text-xs"
		@click="copyToClipboard"
	>
		<div
			v-if="showIcon"
			class="text-center"
		>
			<g-icon name="id" />
		</div>
		<div class="g-bg-400 truncate px-1 text-center">
			{{ id }}
		</div>
	</div>
</template>
<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const { showIcon = true, id } = defineProps<{ id: string; showIcon?: boolean }>()
const message = useMessage()
const { t } = useI18n()

const copyToClipboard = () => {
	if (id) {
		navigator.clipboard.writeText(id)
		message.success(t('copiedToClipboard'))
	}
}
</script>
