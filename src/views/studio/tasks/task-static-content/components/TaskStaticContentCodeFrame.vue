<template>
	<div class="m-2 h-full rounded bg-paper-100 dark:bg-carbon-200">
		<NTabs
			type="line"
			class="pr-4 pl-4 bg-paper-100 rounded"
		>
			<NTabPane
				class="w-full !h-full"
				name="html"
			>
				<template #tab>
					<strong>HTML</strong>
				</template>
				<CodeEditor
					v-model="codeData.localTask.project.html"
					height="calc(100vh - 130px)"
					class="pb-4 !h-full overflow-hidden rounded"
				/>
			</NTabPane>
			<NTabPane
				class="w-full !h-full"
				name="script"
			>
				<template #tab>
					<strong>Script</strong>
				</template>
				<CodeEditor
					v-model="codeData.localTask.project.script"
					height="calc(100vh - 130px)"
					class="!h-full overflow-hidden rounded"
				/>
			</NTabPane>
			<NTabPane
				class="w-full !h-full"
				name="style"
			>
				<template #tab>
					<strong>Style</strong>
				</template>
				<CodeEditor
					v-model="codeData.localTask.project.style"
					height="calc(100vh - 130px)"
					class="!h-full overflow-hidden rounded"
				/>
			</NTabPane>
		</NTabs>
	</div>
</template>

<script setup lang="ts">
import CodeEditor from '@/components/code-editor/CodeEditor.vue'
import { NTabs, NTabPane } from 'naive-ui'
import { useCodeDataStore } from '../store/useTaskStaticContentStore'

const codeData = useCodeDataStore()
</script>
