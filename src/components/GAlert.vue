<template>
	<div
		class="g-bg-2 g-border-400 w-full rounded px-2 py-2"
		:class="{ 'border-0 shadow': shadow }"
	>
		<i
			v-if="showIcon"
			class="me-2 font-bold text-prime"
		>
			i
		</i>
		<template v-if="title">{{ title }}</template>
		<template v-else>
			<b>{{ $t('noData') }}</b>
		</template>
	</div>
</template>

<script setup lang="ts">
const {
	showIcon = false,
	title = undefined,
	shadow = false
} = defineProps<{ showIcon?: boolean; title: string; content?: string; shadow?: boolean }>()
</script>
