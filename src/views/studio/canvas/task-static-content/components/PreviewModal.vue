<script setup lang="ts">
import { NCard, NModal } from 'naive-ui'

const props = defineProps({
	openPreviewModal: {
		type: Boolean,
		required: true
	}
})

const emit = defineEmits(['update:openPreviewModal'])

const closeModal = () => {
	emit('update:openPreviewModal', false)
}
</script>

<template>
	<NModal
		v-model:show="props.openPreviewModal"
		style="width: 100vw; height: 100vh; top: 0; left: 0"
		:mask-closable="false"
		preset="card"
		title="Preview"
		@update:show="closeModal"
	>
		<div style="flex">
			<NCard
				class="h-full w-full"
				title="Modal"
				:bordered="true"
				size="huge"
				role="dialog"
				aria-modal="true"
			>
				Papagaio
			</NCard>
		</div>
	</NModal>
</template>
