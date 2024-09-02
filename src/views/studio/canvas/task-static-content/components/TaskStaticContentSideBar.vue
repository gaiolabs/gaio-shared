<template>
	<div class="m-2 h-full rounded bg-paper-100 dark:bg-carbon-200">
		<NScrollbar style="max-height: calc(100vh - 72px)">
			<div class="flex items-center justify-between p-3 pb-0 pt-2 font-bold">
				<div class="text-lg">
					{{ $t('general') }}
				</div>
			</div>
		</NScrollbar>
	</div>
</template>

<script setup lang="ts">
import GIcon from '@/components/GIcon.vue'
import { NScrollbar, NButton } from 'naive-ui'
import { ref } from 'vue'

let htmlCode = ref('')
let cssCode = ref('')
let jsCode = ref('')
</script>
