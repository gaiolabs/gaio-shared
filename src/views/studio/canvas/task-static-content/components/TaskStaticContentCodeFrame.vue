<template>
	<div class="m-2 h-full rounded bg-paper-100 dark:bg-carbon-200">
		<NTabs type="line" class="!h-full pr-4 pl-4 pb-6 bg-white rounded">
			<NTabPane class="w-full !h-full" name="html">
				<template #tab>
					<strong>HTML</strong>
				</template>
				<CodeEditor v-model="htmlCode" height="85vh" class="!h-full overflow-hidden rounded" />
			</NTabPane>
			<NTabPane class="w-full !h-full" name="script">
				<template #tab>
					<strong>Script</strong>
				</template>
				<CodeEditor v-model="jsCode" height="85vh" class="!h-full overflow-hidden rounded" />
			</NTabPane>
			<NTabPane class="w-full !h-full" name="style">
				<template #tab>
					<strong>Style</strong>
				</template>
				<CodeEditor v-model="cssCode" height="85vh" class="!h-full overflow-hidden rounded" />
			</NTabPane>
		</NTabs>
	</div>
</template>

<script setup lang="ts">
import CodeEditor from '@/components/code-editor/CodeEditor.vue'
import { NScrollbar, NTabs, NTabPane } from 'naive-ui'
import { Pane, Splitpanes } from 'splitpanes'
import { ref, watch } from 'vue'

let htmlCode = ref('')
let cssCode = ref('')
let jsCode = ref('')

watch(htmlCode, (newVal, oldVal) => {})
</script>
