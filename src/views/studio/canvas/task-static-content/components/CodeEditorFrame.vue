<script setup lang="ts">
import { NScrollbar, NTabs, NTabPane } from 'naive-ui'
import { Pane, Splitpanes } from 'splitpanes'
import { STORAGE_NAMES, LANGUAGES, PAYLOAD } from '../types/types'
import CodeEditor from './CodeEditor.vue'

defineEmits(['close'])

const onChange = () => {
	console.log('papagaio')
}
</script>

<template>
	<Splitpanes class="h-full w-full">
		<Pane :size="50" class="w-full h-full">
			<NTabs type="line" animated class="h-full bg-white">
				<NTabPane class="w-full h-full" name="html">
					<template #tab>
						<strong>HTML</strong>
					</template>
					<CodeEditor
						class="w-full h-full"
						:type="LANGUAGES.CSS"
						:display-name="LANGUAGES.CSS"
						@code-change="onChange"
					/>
				</NTabPane>
				<NTabPane name="script">
					<template #tab>
						<strong>Script</strong>
					</template>
					Hey Jude
				</NTabPane>
				<NTabPane name="style">
					<template #tab>
						<strong>Style</strong>
					</template>
					Qilixiang
				</NTabPane>
			</NTabs>
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
