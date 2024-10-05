<!-- AlignmentToolbar.vue -->
<template>
	<Transition
		enter-active-class="transition-all duration-500"
		enter-from-class="opacity-0 translate-y-2"
		enter-to-class="opacity-100"
		leave-active-class="transition-all duration-500"
		leave-from-class="opacity-100"
		leave-to-class="opacity-0 translate-y-2"
		mode="out-in"
	>
		<div
			v-if="getSelectedNodes.length > 1"
			class="flex items-center gap-2"
		>
			<!-- Vertical Alignment Toolbar -->
			<GCard
				id="vertical-align-toolbar"
				type="wrapper"
				class="flex flex-col rounded-xl py-1"
			>
				<GButton
					size="tiny"
					type="tertiary"
					class="!p-2"
					no-line
					@click="alignTop"
				>
					<IconComponent
						class="size-5"
						name="AlignTop"
					/>
				</GButton>
				<GButton
					size="tiny"
					type="tertiary"
					class="!p-2"
					no-line
					@click="alignVerticalCenter"
				>
					<IconComponent
						class="size-5"
						name="AlignVertical"
					/>
				</GButton>
				<GButton
					size="tiny"
					type="tertiary"
					class="!p-2"
					no-line
					@click="alignBottom"
				>
					<IconComponent
						class="size-5"
						name="AlignBottom"
					/>
				</GButton>
				<GButton
					size="tiny"
					type="tertiary"
					class="!p-2"
					no-line
					@click="distributeVertical"
				>
					<IconComponent
						class="size-5"
						name="DistributeVertical"
					/>
				</GButton>
			</GCard>

			<!-- Horizontal Alignment Toolbar -->
			<GCard
				id="horizontal-align-toolbar"
				type="wrapper"
				class="flex flex-col rounded-xl py-1"
			>
				<GButton
					size="tiny"
					type="tertiary"
					class="!p-2"
					no-line
					@click="alignLeft"
				>
					<IconComponent
						class="size-5"
						name="AlignLeft"
					/>
				</GButton>
				<GButton
					size="tiny"
					type="tertiary"
					class="!p-2"
					no-line
					@click="alignHorizontalCenter"
				>
					<IconComponent
						class="size-5"
						name="AlignHorizontal"
					/>
				</GButton>
				<GButton
					size="tiny"
					type="tertiary"
					class="!p-2"
					no-line
					@click="alignRight"
				>
					<IconComponent
						class="size-5"
						name="AlignRight"
					/>
				</GButton>
				<GButton
					size="tiny"
					type="tertiary"
					class="!p-2"
					no-line
					@click="distributeHorizontal"
				>
					<IconComponent
						class="size-5"
						name="DistributeHorizontal"
					/>
				</GButton>
			</GCard>
		</div>
	</Transition>
</template>

<script setup lang="ts">
import GCard from '@/components/GCard.vue'
import GButton from '@/components/inputs/GButton.vue'
import type { Node } from '@vue-flow/core'
import { useEventListener } from '@vueuse/core'
import { ref } from 'vue'
import { defineProps } from 'vue'

// Define grid snapping value
const gridSnap = ref(5)

// Define component props
const { getSelectedNodes } = defineProps({
	getSelectedNodes: {
		type: Array as () => Node[],
		required: true,
	},
})

// Alignment Functions
function alignTop() {
	const minY = Math.min(...getSelectedNodes.map((node) => node.position.y))
	const minYSnap = Math.round(minY / gridSnap.value) * gridSnap.value
	getSelectedNodes.forEach((node) => {
		node.position.y = minYSnap
	})
}

function alignVerticalCenter() {
	const minY = Math.min(...getSelectedNodes.map((node) => node.position.y))
	const maxY = Math.max(...getSelectedNodes.map((node) => node.position.y))
	const yCenter = (minY + maxY) / 2
	const yCenterSnap = Math.round(yCenter / gridSnap.value) * gridSnap.value
	getSelectedNodes.forEach((node) => {
		node.position.y = yCenterSnap
	})
}

function alignBottom() {
	const maxY = Math.max(...getSelectedNodes.map((node) => node.position.y))
	const maxYSnap = Math.round(maxY / gridSnap.value) * gridSnap.value
	getSelectedNodes.forEach((node) => {
		node.position.y = maxYSnap
	})
}

function distributeVertical() {
	const nodes = [...getSelectedNodes].sort((a, b) => a.position.y - b.position.y)
	const nodeCount = nodes.length
	if (nodeCount <= 2) return

	const firstNodeY = nodes[0].position.y
	const lastNodeY = nodes[nodeCount - 1].position.y
	const totalDistance = lastNodeY - firstNodeY
	const gapCount = nodeCount - 1
	const spacing = totalDistance / gapCount

	nodes.forEach((node, index) => {
		const newY = firstNodeY + spacing * index
		node.position.y = Math.round(newY / gridSnap.value) * gridSnap.value
	})
}

function alignLeft() {
	const minX = Math.min(...getSelectedNodes.map((node) => node.position.x))
	const minXSnap = Math.round(minX / gridSnap.value) * gridSnap.value
	getSelectedNodes.forEach((node) => {
		node.position.x = minXSnap
	})
}

function alignHorizontalCenter() {
	const minX = Math.min(...getSelectedNodes.map((node) => node.position.x))
	const maxX = Math.max(...getSelectedNodes.map((node) => node.position.x))
	const xCenter = (minX + maxX) / 2
	const xCenterSnap = Math.round(xCenter / gridSnap.value) * gridSnap.value
	getSelectedNodes.forEach((node) => {
		node.position.x = xCenterSnap
	})
}

function alignRight() {
	const maxX = Math.max(...getSelectedNodes.map((node) => node.position.x))
	const maxXSnap = Math.round(maxX / gridSnap.value) * gridSnap.value
	getSelectedNodes.forEach((node) => {
		node.position.x = maxXSnap
	})
}

function distributeHorizontal() {
	const nodes = [...getSelectedNodes].sort((a, b) => a.position.x - b.position.x)
	const nodeCount = nodes.length
	if (nodeCount <= 2) return

	const firstNodeX = nodes[0].position.x
	const lastNodeX = nodes[nodeCount - 1].position.x
	const totalDistance = lastNodeX - firstNodeX
	const gapCount = nodeCount - 1
	const spacing = totalDistance / gapCount

	nodes.forEach((node, index) => {
		const newX = firstNodeX + spacing * index
		node.position.x = Math.round(newX / gridSnap.value) * gridSnap.value
	})
}

async function alignCenter() {
	if (getSelectedNodes.length === 0) return

	const nodes = getSelectedNodes
	let minX = Math.min(...nodes.map((node) => node.position.x))
	let maxX = Math.max(...nodes.map((node) => node.position.x))
	let minY = Math.min(...nodes.map((node) => node.position.y))
	let maxY = Math.max(...nodes.map((node) => node.position.y))

	const before = structuredClone({
		minX,
		maxX,
		minY,
		maxY,
	})

	const spreadX = maxX - minX
	const spreadY = maxY - minY

	if (spreadX > spreadY) {
		alignVerticalCenter()
	} else {
		alignHorizontalCenter()
	}

	await nextTick()
	minX = Math.min(...nodes.map((node) => node.position.x))
	maxX = Math.max(...nodes.map((node) => node.position.x))
	minY = Math.min(...nodes.map((node) => node.position.y))
	maxY = Math.max(...nodes.map((node) => node.position.y))

	const after = structuredClone({
		minX,
		maxX,
		minY,
		maxY,
	})

	const isEqual = Object.keys(before).every((key) => before[key] === after[key])
	console.log(before, after, isEqual)
	if (isEqual) distributeCenter()
}

function distributeCenter() {
	if (getSelectedNodes.length === 0) return

	const nodes = getSelectedNodes
	const minX = Math.min(...nodes.map((node) => node.position.x))
	const maxX = Math.max(...nodes.map((node) => node.position.x))
	const minY = Math.min(...nodes.map((node) => node.position.y))
	const maxY = Math.max(...nodes.map((node) => node.position.y))

	const spreadX = maxX - minX
	const spreadY = maxY - minY

	if (spreadX > spreadY) {
		distributeHorizontal()
	} else {
		distributeVertical()
	}
}

// Keyboard Shortcuts
useEventListener('keydown', (event: KeyboardEvent) => {
	const activeElement = document.activeElement as HTMLElement | null
	if (!activeElement) return

	const isFocusedOnSlectionBox = activeElement.classList.contains('vue-flow__nodesselection-rect')

	if (!isFocusedOnSlectionBox) return // Do not trigger shortcuts if typing in editable elements

	// Define key-action mapping
	const keyActions: Record<string, () => void> = {
		T: alignTop,
		C: alignCenter,
		B: alignBottom,
		L: alignLeft,
		R: alignRight,
		D: distributeCenter,
	}

	const key = event.key.toUpperCase()
	if (key in keyActions) {
		event.preventDefault() // Prevent default action if necessary
		keyActions[key]()
	}
})
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
