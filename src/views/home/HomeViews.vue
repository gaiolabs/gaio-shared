<template>
	<div class="home-views g-bg-1 my-3 rounded shadow">
		<div class="flex items-center justify-between gap-4 px-4 py-2">
			<div
				class="flex flex-row items-center gap-1 text-lg font-bold"
				@click="collapse = !collapse"
			>
				<g-icon name="imageSearch" />
				10 {{ $t('views') }}
			</div>

			<n-button tertiary>
				{{ $t('seeAll') }}
			</n-button>
		</div>
		<div
			v-if="collapse"
			class="animate-fade-in mt-3 w-full px-4 pb-4"
		>
			<n-space>
				<g-card>Test</g-card>
				<g-card>Test</g-card>
				<g-card>Test</g-card>
			</n-space>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const collapse = ref(false)
</script>
