<template>
	<div class="g-base p-4 rounded-xl">
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
defineProps<{ showIcon?: boolean; title: string; content?: string; shadow?: boolean }>()
</script>
