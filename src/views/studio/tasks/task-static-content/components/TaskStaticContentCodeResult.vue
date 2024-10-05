<template>
	<div
		style="height: calc(100vh - 75px)"
		class="flex flex-col items-start justify-start m-2 rounded bg-paper-100 dark:bg-carbon-200 p-4"
	>
		<NInputGroup class="flex justify-around">
			<NInputNumber
				bordered
				placeholder=""
				:update-value-on-input="true"
				size="large"
				class="rounded centered-input"
				:validator="(value) => typeof value === 'number'"
				:value="newWidth"
				@update:value="(value) => (newWidth = value)"
			>
				<template #prefix>{{ $t('width') }}:</template>
				<template #suffix>px</template>
			</NInputNumber>
			<NInputNumber
				bordered
				placeholder=""
				:update-value-on-input="true"
				size="large"
				class="rounded centered-input"
				:value="newHeight"
				@update:value="(value) => (newHeight = value)"
			>
				<template #prefix>{{ $t('height') }}:</template>
				<template #suffix>px</template>
			</NInputNumber>
		</NInputGroup>

		<iframe
			:srcdoc="iframeSrcdoc"
			class="border border-black mt-4"
			:style="{
				width: newWidth + 'px',
				height: newHeight + 'px',
				['max-height']: 'calc(100vh - 75px)'
			}"
		></iframe>
	</div>
</template>

<script setup lang="ts">
import { NInputGroup, NInputNumber } from 'naive-ui'
import { computed, ref } from 'vue'
import { useCodeDataStore } from '../store/useTaskStaticContentStore'

const newWidth = ref(500)
const newHeight = ref(600)

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
