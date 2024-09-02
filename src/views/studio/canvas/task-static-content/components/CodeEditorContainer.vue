<template>
	<Splitpanes>
		<Pane :size="50">
			<div class="m-2 h-full rounded bg-paper-100 dark:bg-carbon-200">
				<NTabs type="line" animated class="!h-full pr-4 pl-4 pb-6 pt-6 bg-green-500">
					<NTabPane class="w-full !h-full" name="html">
						<template #tab>
							<strong>HTML</strong>
						</template>
						<CodeEditor v-model="htmlCode" height="calc(100vh - 100px)" class="overflow-hidden rounded" />
					</NTabPane>
					<NTabPane class="w-full !h-full" name="script">
						<template #tab>
							<strong>Script</strong>
						</template>
						<CodeEditor v-model="jsCode" class="h-full overflow-hidden rounded" />
					</NTabPane>
					<NTabPane class="w-full !h-full" name="style">
						<template #tab>
							<strong>Style</strong>
						</template>
						<CodeEditor v-model="cssCode" class="h-screen overflow-hidden rounded" />
					</NTabPane>
				</NTabs>
			</div>
		</Pane>
		<Pane :size="50">
			<div class="m-2 h-full rounded bg-paper-100 dark:bg-carbon-200">
				<NScrollbar style="max-height: calc(100vh - 72px)">
					<div class="flex justify-between px-2 pb-1 pt-2 text-lg font-bold">
						{{ $t('options') }}
					</div>
				</NScrollbar>
			</div>
		</Pane>
	</Splitpanes>
</template>

<script setup lang="ts">
import CodeEditor from '@/components/code-editor/CodeEditor.vue'
import { NScrollbar, NTabs, NTabPane } from 'naive-ui'
import { Pane, Splitpanes } from 'splitpanes'
import { ref } from 'vue'

let htmlCode = ref('')
let cssCode = ref('')
let jsCode = ref('')
</script>
