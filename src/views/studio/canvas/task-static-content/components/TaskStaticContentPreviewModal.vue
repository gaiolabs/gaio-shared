<template>
	<NModal
		v-model:show="viewControl.showPreviewModal"
		style="width: 100vw; height: 100vh; top: 0; left: 0"
		:mask-closable="false"
		preset="card"
		title="Preview"
	>
		<div class="flex items-center justify-center w-full h-full">
			<iframe
				:srcdoc="iframeSrcdoc"
				class="w-full h-full border border-black"
			></iframe>
		</div>
	</NModal>
</template>

<script setup lang="ts">
import { NModal } from 'naive-ui'
import { computed } from 'vue'
import { useCodeDataStore, useViewControlStore } from '../store/useTaskStaticContentStore'

const viewControl = useViewControlStore()

const iframeSrcdoc = computed(() => {
	const store = useCodeDataStore()
	return (
		`${store.localTask.project.html}` +
		`<script>${store.localTask.project.scriptCode}</scr` +
		`ipt><style>${store.localTask.project.style}</style>
  `
	)
})
</script>
