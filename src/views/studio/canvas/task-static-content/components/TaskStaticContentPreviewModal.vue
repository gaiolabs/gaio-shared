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
				:srcdoc="
					codeData.localTask.project.html +
					`<script>${codeData.localTask.project.script}</script>` +
					`<style>${codeData.localTask.project.style}</style>`
				"
				class="w-full h-full border border-black"
			></iframe>
		</div>
	</NModal>
</template>

<script setup lang="ts">
import { NModal } from 'naive-ui'
import { useCodeDataStore, useViewControlStore } from '../store/useTaskStaticContentStore'

const viewControl = useViewControlStore()
const codeData = useCodeDataStore()
</script>
