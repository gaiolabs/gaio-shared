<template>
	<GCard
		id="main-toolbar"
		type="wrapper"
		class="flex rounded-xl px-1"
	>
		<GButton
			size="tiny"
			type="tertiary"
			class="!p-2"
			@click="$emit('organize-layout', 'LR')"
		>
			<IconComponent
				class="rotate-[-90deg] size-5"
				name="Studio"
			/>
		</GButton>
		<GButton
			size="tiny"
			type="tertiary"
			class="!p-2"
			@click="$emit('fit-view')"
		>
			<IconComponent name="AdjustToScreen" />
		</GButton>
	</GCard>
</template>

<script setup lang="ts">
import GCard from '@/components/GCard.vue'
import GButton from '@/components/inputs/GButton.vue'

// Emit events to the parent component
defineEmits(['organize-layout', 'fit-view'])
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
