<template>
	<GCard
		type="wrapper"
		class="flex rounded-xl px-1 items-center"
	>
		<!-- Zoom Out Button -->
		<GButton
			size="tiny"
			type="tertiary"
			class="!p-2"
			@click="$emit('zoom-out')"
		>
			<IconComponent name="ZoomOut" />
		</GButton>

		<!-- Zoom Level Display / Input Wrapper -->
		<div
			class="-mx-2 text-sm text-center"
			@mouseenter="isHovering = true"
			@mouseleave="isHovering = false"
		>
			<!-- Zoom Level Text -->
			<div
				v-if="!isHovering"
				class="w-12 text-gray-450 pl-1"
			>
				{{ Math.round(zoomLevel * 100) }}%
			</div>
			<!-- Zoom Level Input -->
			<input
				v-else
				v-model="zoomInput"
				type="text"
				class="text-center text-md w-12 px-0 border border-transparent focus:outline-none focus:border-gray-300 rounded"
				@focus="onFocus"
				@blur="onBlur"
				@keydown.enter="onEnter"
			/>
		</div>

		<!-- Zoom In Button -->
		<GButton
			size="tiny"
			type="tertiary"
			class="!p-2"
			@click="$emit('zoom-in')"
		>
			<IconComponent name="ZoomIn" />
		</GButton>

		<div class="bg-gray-200 dark:bg-white/10 w-px h-5"></div>

		<!-- Organize Button -->
		<GButton
			size="tiny"
			type="tertiary"
			class="!p-2 !pr-1.5"
			@click="$emit('organize-layout', 'LR')"
		>
			<IconComponent
				class="rotate-[-90deg] size-5"
				name="Studio"
			/>
		</GButton>

		<!-- Fit View Button -->
		<GButton
			size="tiny"
			type="tertiary"
			class="!p-2 !pl-1.5"
			@click="$emit('fit-view')"
		>
			<IconComponent name="AdjustToScreen" />
		</GButton>
	</GCard>
</template>

<script setup lang="ts">
import GCard from '@/components/GCard.vue'
import GButton from '@/components/inputs/GButton.vue'
import { useEventListener } from '@vueuse/core'

const props = defineProps({
	zoomLevel: {
		type: Number,
		default: 1,
	},
})

const emit = defineEmits(['zoom-in', 'zoom-out', 'set-zoom', 'organize-layout', 'fit-view'])

const zoomInput = ref(Math.round(props.zoomLevel * 100).toString())
const isHovering = ref(false)

// Watch for changes in zoomLevel prop to update the input value
watch(
	() => props.zoomLevel,
	(newZoomLevel) => {
		zoomInput.value = Math.round(newZoomLevel * 100).toString()
	},
)

function onFocus(event: any) {
	event.target.select()
}

function onBlur() {
	updateZoom()
	isHovering.value = false
}

function onEnter() {
	updateZoom()
	isHovering.value = false
}

function updateZoom() {
	const numericValue = zoomInput.value.replace(/[^\d]/g, '')
	let zoomPercentage = parseInt(numericValue, 10)

	if (isNaN(zoomPercentage) || zoomPercentage <= 0) {
		zoomPercentage = Math.round(props.zoomLevel * 100)
	} else if (zoomPercentage > 400) {
		zoomPercentage = 400 // Max zoom level is 400%
	}

	zoomInput.value = zoomPercentage.toString()
	const newZoomLevel = zoomPercentage / 100
	emit('set-zoom', newZoomLevel)
}

useEventListener('keydown', (event: KeyboardEvent) => {
	const activeElement = document.activeElement as HTMLElement | null
	if (!activeElement) return

	// Check if the active element is an input, textarea, or contenteditable
	const isEditable =
		activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable

	if (isEditable) return // Do not trigger shortcuts if typing in editable elements

	if (event.key === '+' || event.key === '=') {
		event.preventDefault()
		emit('zoom-in')
	}

	if (event.key === '-') {
		event.preventDefault()
		emit('zoom-out')
	}

	if (event.key.toUpperCase() === 'F') {
		event.preventDefault()
		emit('fit-view')
	}

	if (event.key.toUpperCase() === 'O') {
		event.preventDefault()
		emit('organize-layout', 'LR') // Assuming 'LR' is a predefined layout type
	}
})
</script>
