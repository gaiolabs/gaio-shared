<script setup lang="ts">
import { NCard, NModal } from 'naive-ui'
import { useTaskStaticContentStore } from '../store/useTaskStaticContentStore'

const viewControlStore = useTaskStaticContentStore()
</script>

<template>
	<NModal
		v-model:show="viewControlStore.showPreviewModal"
		style="width: 100vw; height: 100vh; top: 0; left: 0"
		:mask-closable="false"
		preset="card"
		title="Preview"
	>
		<div class="flex">
			<NCard class="h-full w-full" title="Modal" :bordered="true" size="huge" role="dialog" aria-modal="true">
				Papagaio
			</NCard>
		</div>
	</NModal>
</template>
