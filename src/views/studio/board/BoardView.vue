<template>
	<div
		id="board-view"
		class="w-full h-full"
	>
		<VueFlow
			v-if="showBoard"
			ref="graph"
			v-model="elements"
			:class="[isPressed ? 'isPressed' : '']"
			:min-zoom="0.25"
			:max-zoom="4"
			:snap-to-grid="true"
			:snap-grid="[5, 5]"
			:selection-mode="SelectionMode.Partial"
			:nodes-draggable="!isLocked"
			:nodes-connectable="!isLocked"
			:elements-selectable="!isLocked"
			@selection-end="onSelectMany()"
			@node-click="onSelectNode($event)"
			@node-double-click="onOpenNode($event)"
			@node-drag-stop="(e) => (e.node.data.position = e.node.position)"
		>
			<template #node-custom="{ data }">
				<BoardNode :data="data" />
			</template>
			<!-- <BoardBackground /> -->
			<Background
				id="board-background"
				class="relative"
				:pattern-color="isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.15)'"
				:gap="15"
				:size="1.25"
				patternTransform="translate(1,0)"
			/>
		</VueFlow>

		<div
			id="board-safe-zone-wrapper"
			class="absolute top-[74px] bottom-4 p-8 right-8 pointer-events-none"
			:class="[
				isSidebarOpen ? 'left-[464px]' : 'left-[72px]',
				useDebugModeStore().isActive ? 'opacity-100' : 'opacity-0',
			]"
		>
			<div
				id="board-safe-zone"
				ref="safeZone"
				class="border border-dashed border-[#f00] w-full h-full flex items-start"
			>
				<div class="bg-[rgba(255,0,0,0.1)] text-[#f00] text-xs px-2 py-1 rounded-br-2xl">Safe Zone</div>
			</div>
		</div>

		<BoardHeader
			v-if="elements"
			:elements="elements"
			@open="$emit('choose', $event)"
		/>
		<aside class="z-1 absolute bottom-0 right-0 p-4 flex flex-col items-end gap-2">
			<AlignmentToolbar :get-selected-nodes="getSelectedNodes" />
			<MainToolbar
				:zoom-level="zoomLevel"
				:locked="isLocked"
				@zoom-in="zoomIn"
				@zoom-out="zoomOut"
				@set-zoom="handleSetZoom"
				@organize-layout="organizeDagreLayout"
				@fit-view="fitView"
				@toggle-lock="toggleLock"
			/>
		</aside>
	</div>
</template>

<script setup lang="ts">
import useApi from '@/composables/useApi'
import useHelper from '@/composables/useHelper'
import { useAppStore } from '@/stores'
import { useDebugModeStore } from '@/stores/useDebugModeStore'
import { useJobStore } from '@/stores/useJobStore'
import BoardHeader from '@/views/studio/board/BoardHeader.vue'
import BoardNode from '@/views/studio/board/BoardNode.vue'
import AlignmentToolbar from '@/views/studio/board/toolbars/AlignmentToolbar.vue'
import MainToolbar from '@/views/studio/board/toolbars/MainToolbar.vue'
import { Background } from '@vue-flow/background'
import { Position, useVueFlow, VueFlow, getRectOfNodes, SelectionMode } from '@vue-flow/core'
import type { Elements, NodeMouseEvent } from '@vue-flow/core'
import { useDark, usePointer } from '@vueuse/core'
import dagre from 'dagre'
import { debounce } from 'lodash-es'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

const { onConnect, addEdges, nodes, edges, getSelectedNodes, viewport, setViewport, getNodes } = useVueFlow()
const emit = defineEmits(['choose', 'open'])
const showBoard = ref(true)
const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))
let elements = ref<Elements>([])
const localNodes = ref()
const localEdges = ref()
const isDark = useDark()

const selectMany = ref([])
const graph = ref()
const safeZone = ref()
const pointer = usePointer()
const isPressed = computed(() => {
	return pointer.pressure.value > 0
})

const { isSidebarOpen } = defineProps({
	isSidebarOpen: {
		type: Boolean,
		default: false,
	},
})

const onOpenNode = (ev: NodeMouseEvent) => {
	emit('open', ev.node.data)
}

const onSelectMany = () => {
	// console.log(JSON.stringify(getSelectedNodes.value, null, 2))
	useAppStore().task = null
	selectMany.value = getSelectedNodes.value
}

const onSelectNode = (ev: NodeMouseEvent) => {
	useAppStore().task = ev.node.data
}

onConnect((params) => {
	// avoid self connection
	if (params.source === params.target) return

	// avoid forbidden edge connection
	if (params.sourceHandle === params.targetHandle) return

	// avoid duplicated edges
	if (edges.value.some((edge) => edge.source === params.source && edge.target === params.target)) return

	addEdges({
		...params,
		type: 'smoothstep',
	})
})

const updateFlow = debounce(() => {
	const workflow = {
		nodes: nodes.value.map((node) => {
			return {
				...node.data,
				position: node.position,
			}
		}),
		edges: edges.value.map((edge) => {
			return {
				...edge.data,
				id: useHelper().generateId(),
				source: edge.source,
				target: edge.target,
				type: 'smoothstep',
			}
		}),
	}

	useApi('boardUpdateFlow').post('api/flow/save', {
		body: {
			flowData: {
				...useAppStore().flow,
				workflow,
			},
		},
	})
}, 600)

const isLocked = ref(false)

// Function to toggle lock state
function toggleLock() {
	isLocked.value = !isLocked.value
}

// Zoom level state
const zoomLevel = ref(1) // Initial zoom level is 1 (100%)
const zoomStep = ref(0.1) // Zoom step value
function roundToStep(value: number, step: number) {
	const inv = 1.0 / step
	return Math.round(value * inv) / inv
}

// Watch the viewport zoom level
watch(
	() => viewport.value.zoom,
	(newZoom) => {
		zoomLevel.value = newZoom
	},
)

// Zoom methods
function zoomIn() {
	let currentZoom = zoomLevel.value
	let newZoom = roundToStep(currentZoom, zoomStep.value) + zoomStep.value
	newZoom = Math.min(newZoom, 4) // Max zoom level is 4
	setZoom(newZoom)
}

function zoomOut() {
	let currentZoom = zoomLevel.value
	let newZoom = roundToStep(currentZoom, zoomStep.value) - zoomStep.value
	newZoom = Math.max(newZoom, 0.2) // Min zoom level is 0.2
	setZoom(newZoom)
}

function setZoom(newZoom: number) {
	const { x: currentX, y: currentY, zoom: currentZoom } = viewport.value

	// Ensure safeZone is available
	if (!safeZone.value) return

	// Get the bounding rectangles
	const graphEl = graph.value.$el
	const safeZoneEl = safeZone.value

	const graphRect = graphEl.getBoundingClientRect()
	const safeZoneRect = safeZoneEl.getBoundingClientRect()

	// Calculate the center of the safeZone relative to the graph
	const safeZoneCenterX = safeZoneRect.left + safeZoneRect.width / 2 - graphRect.left
	const safeZoneCenterY = safeZoneRect.top + safeZoneRect.height / 2 - graphRect.top

	// Convert screen coordinates to world coordinates
	const worldCenterX = (safeZoneCenterX - currentX) / currentZoom
	const worldCenterY = (safeZoneCenterY - currentY) / currentZoom

	// Calculate new x and y to keep the safeZone center fixed
	const newX = safeZoneCenterX - worldCenterX * newZoom
	const newY = safeZoneCenterY - worldCenterY * newZoom

	// Apply the new viewport settings
	setViewport({ x: newX, y: newY, zoom: newZoom }, { duration: 150 })
}

// Handle 'set-zoom' event from toolbar
function handleSetZoom(newZoom: number) {
	newZoom = Math.max(0.2, Math.min(newZoom, 4)) // Ensure zoom is within bounds
	setZoom(newZoom)
}

function fitView(fixedZoom?: number, isCentered: boolean = false) {
	const selectedNodes = getSelectedNodes.value
	const nodesToFit = selectedNodes.length > 1 ? selectedNodes : getNodes.value

	if (nodesToFit.length === 0) return

	// Get the bounding box of the nodes to fit
	const nodesBoundingBox = getRectOfNodes(nodesToFit)

	// Get the DOM elements
	const graphEl = graph.value.$el
	const safeZoneEl = safeZone.value

	// Get their bounding rectangles
	const graphRect = graphEl.getBoundingClientRect()
	const safeZoneRect = safeZoneEl.getBoundingClientRect()

	// Calculate the safeZone dimensions relative to the graph component
	const safeArea = {
		x: safeZoneRect.left - graphRect.left,
		y: safeZoneRect.top - graphRect.top,
		width: safeZoneRect.width,
		height: safeZoneRect.height,
	}

	// Compute the zoom factor needed to fit the nodes into the safeZone
	const zoomX = safeArea.width / nodesBoundingBox.width
	const zoomY = safeArea.height / nodesBoundingBox.height
	let zoom = Math.min(zoomX, zoomY)

	// Limit the zoom to the maximum zoom allowed
	const maxZoom = 1.5 // Adjust maxZoom as needed
	zoom = Math.min(zoom, maxZoom)

	let x, y

	if (selectedNodes.length > 1) isCentered = true
	if (isCentered) {
		// Compute centers
		const nodesCenterX = nodesBoundingBox.x + nodesBoundingBox.width / 2
		const nodesCenterY = nodesBoundingBox.y + nodesBoundingBox.height / 2
		const safeZoneCenterX = safeArea.x + safeArea.width / 2
		const safeZoneCenterY = safeArea.y + safeArea.height / 2

		// Compute the pan (translation) needed to center the nodes within the safeZone
		x = -nodesCenterX * zoom + safeZoneCenterX
		y = -nodesCenterY * zoom + safeZoneCenterY
	} else {
		// Align the top-left of the nodesBoundingBox to the top-left of the safeZone
		x = -nodesBoundingBox.x * zoom + safeArea.x
		y = -nodesBoundingBox.y * zoom + safeArea.y
	}

	// Apply the transformation to the VueFlow instance
	setViewport({ x, y, zoom: fixedZoom !== undefined ? fixedZoom : zoom }, { duration: 150 })
}

const organizeDagreLayout = (direction: string) => {
	if (isLocked.value) return
	const selectedNodes = getSelectedNodes.value
	const nodesToLayout = selectedNodes.length > 1 ? selectedNodes : nodes.value

	if (nodesToLayout.length === 0) return

	const isHorizontal = direction === 'LR'

	// Reset the dagre graph
	dagreGraph.setGraph({})
	dagreGraph.nodes().forEach((node) => dagreGraph.removeNode(node))
	// @ts-expect-error TODO fix type
	dagreGraph.edges().forEach((edge) => dagreGraph.removeEdge(edge))

	// Set up the dagre graph with appropriate settings
	dagreGraph.setGraph({
		rankdir: direction,
		align: 'UL',
		marginx: 50,
		marginy: 50,
	})

	// Add nodes to the dagre graph
	nodesToLayout.forEach((node) => {
		dagreGraph.setNode(node.id, { width: 180, height: 60 })
	})

	// Include edges that connect the nodes we're laying out
	const edgesToLayout = edges.value.filter(
		(edge) =>
			nodesToLayout.some((node) => node.id === edge.source) && nodesToLayout.some((node) => node.id === edge.target),
	)

	edgesToLayout.forEach((edge) => {
		dagreGraph.setEdge(edge.source, edge.target)
	})

	// Save the position of the first node before layout
	const firstNode = nodesToLayout[0]
	const originalPosition = { ...firstNode.position }

	// Run the dagre layout algorithm
	dagre.layout(dagreGraph)

	// Get the new position of the first node after layout
	const nodeWithPosition = dagreGraph.node(firstNode.id)
	const newFirstNodePosition = {
		x: nodeWithPosition.x,
		y: nodeWithPosition.y,
	}

	// Calculate the offset between the original and new positions
	const offsetX = originalPosition.x - newFirstNodePosition.x
	const offsetY = originalPosition.y - newFirstNodePosition.y

	// Update node positions based on the layout, applying the offset
	nodesToLayout.forEach((node) => {
		const nodeData = dagreGraph.node(node.id)

		// Set node handle positions based on layout direction
		node.targetPosition = isHorizontal ? Position.Left : Position.Top
		node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom

		// Apply the offset to keep the first node in place
		node.position = {
			x: Math.round((nodeData.x + offsetX) / 5) * 5,
			y: Math.round((nodeData.y + offsetY) / 5) * 5,
		}
	})

	// Ensure Vue reactivity by updating the nodes array
	nodes.value = [...nodes.value]

	// Wait for the next tick to render and fit the view
	nextTick(() => {
		// fitView()
	})
}

// Helper function to adjust parent positions
// const adjustParentPositions = (isHorizontal: any) => {
// 	// Build a mapping from parent nodes to their immediate children
// 	const parentToChildrenMap = {}

// 	// Map each parent node to its children
// 	elements.value.forEach((el) => {
// 		if (!isNode(el)) {
// 			const parent = el.source
// 			const child = el.target

// 			if (!parentToChildrenMap[parent]) {
// 				parentToChildrenMap[parent] = []
// 			}
// 			parentToChildrenMap[parent].push(child)
// 		}
// 	})

// 	// Adjust each parent node's position based on its children's positions
// 	Object.keys(parentToChildrenMap).forEach((parentId) => {
// 		const childrenIds = parentToChildrenMap[parentId]
// 		const childNodes = elements.value.filter((el) => isNode(el) && childrenIds.includes(el.id))

// 		// Calculate the average position of the children
// 		const avgPosition = childNodes.reduce(
// 			(sum, child) => ({
// 				x: sum.x + child.position.x,
// 				y: sum.y + child.position.y,
// 			}),
// 			{ x: 0, y: 0 },
// 		)

// 		avgPosition.x /= childNodes.length
// 		avgPosition.y /= childNodes.length

// 		// Find the parent node
// 		const parentNode = elements.value.find((el) => isNode(el) && el.id === parentId)

// 		if (parentNode) {
// 			// Adjust parent's position based on layout direction
// 			if (isHorizontal) {
// 				// For horizontal layout (LR), adjust y position to average y of children
// 				parentNode.position.y = Math.round(avgPosition.y / 5) * 5
// 			} else {
// 				// For vertical layout (TB), adjust x position to average x of children
// 				parentNode.position.x = Math.round(avgPosition.x / 5) * 5
// 			}

// 			// Check for conflicts and resolve them
// 			resolveConflicts(parentNode, isHorizontal)
// 		}
// 	})
// }

// Helper function to resolve conflicts
// const resolveConflicts = (movedNode, isHorizontal: any) => {
// 	const maxSteps = 10 // Limit to 10 steps
// 	const nodeSize = { width: 180, height: 60 }
// 	const spacing = 20 // Minimum spacing between nodes

// 	let steps = 0

// 	while (steps < maxSteps) {
// 		let conflictFound = false

// 		// Check for conflicts with other nodes
// 		for (let el of elements.value) {
// 			if (isNode(el) && el.id !== movedNode.id) {
// 				if (nodesOverlap(movedNode, el, nodeSize, spacing)) {
// 					// Conflict found, move the conflicting node down or sideways
// 					conflictFound = true
// 					steps++

// 					if (isHorizontal) {
// 						// Move down vertically
// 						el.position.y += nodeSize.height + spacing
// 					} else {
// 						// Move sideways horizontally
// 						el.position.x += nodeSize.width + spacing
// 					}

// 					// Snap to grid
// 					el.position.x = Math.round(el.position.x / 5) * 5
// 					el.position.y = Math.round(el.position.y / 5) * 5

// 					// Break to re-check from the beginning
// 					break
// 				}
// 			}
// 		}

// 		// If no conflicts found, exit the loop
// 		if (!conflictFound) {
// 			break
// 		}
// 	}
// }

// Helper function to check if two nodes overlap
// const nodesOverlap = (
// 	nodeA: { position: { x: any; y: any } },
// 	nodeB,
// 	nodeSize: { width: any; height: any },
// 	spacing: number,
// ) => {
// 	const rectA = {
// 		left: nodeA.position.x,
// 		right: nodeA.position.x + nodeSize.width,
// 		top: nodeA.position.y,
// 		bottom: nodeA.position.y + nodeSize.height,
// 	}

// 	const rectB = {
// 		left: nodeB.position.x,
// 		right: nodeB.position.x + nodeSize.width,
// 		top: nodeB.position.y,
// 		bottom: nodeB.position.y + nodeSize.height,
// 	}

// 	// Check for overlap with spacing buffer
// 	return !(
// 		rectA.right + spacing <= rectB.left ||
// 		rectA.left - spacing >= rectB.right ||
// 		rectA.bottom + spacing <= rectB.top ||
// 		rectA.top - spacing >= rectB.bottom
// 	)
// }

const currentFlowId = computed(() => {
	return useAppStore().flow?.flowId
})
const useJob = useJobStore()

const currentFlow = computed(() => useAppStore().flow)

const buildBoard = () => {
	nextTick(() => {
		localEdges.value = []
		localNodes.value = []
		elements.value = []
		processBoard()
	})
}

const hasInitialized = ref(false)

const processBoard = async () => {
	if (useAppStore().flowList) {
		localEdges.value =
			currentFlow.value?.workflow.edges.map((edge) => {
				return {
					id: edge.id,
					source: edge.source,
					target: edge.target,
					type: 'smoothstep',
				}
			}) || []
		localNodes.value =
			currentFlow.value?.workflow.nodes.map((node) => {
				return {
					id: node.id,
					type: 'custom',
					label: node.label,
					position: node.position,
					data: node,
					sourcePosition: Position.Right,
					targetPosition: Position.Left,
				}
			}) || []

		elements.value = [...localNodes.value, ...localEdges.value]
		showBoard.value = true
		await new Promise((resolve) => setTimeout(resolve, 150))
		nextTick(() => {
			// TODO: Load the last camera position and zoom
			if (!hasInitialized.value) {
				hasInitialized.value = true
				fitView(1)
			}
		})
		// const { token } = useAuthStore();
		// // const a = new EventSource('/api/sse/sse?id=dfs');
		// const localKey = new Date().getTime();
		// const a = new EventSource(
		//     '/api/sse/flow/board?id=' +
		//         `update:flow:${useAppStore().flow?.flowId}-app:${useAppStore().app?.appId}&localKey=${localKey}`
		// );
		//
		// a.addEventListener('message', (e) => {
		//     console.log('from back', e);
		// });
	}
}

const refreshBoard = computed(() => useAppStore().refreshBoard)

watch(
	() => currentFlowId.value,
	() => {
		buildBoard()
	},
)

watch(
	() => refreshBoard.value,
	() => {
		processBoard()
	},
)

watch(
	elements,
	() => {
		updateFlow()
	},
	{ deep: true },
)

onMounted(async () => {
	await useJob.initJobWatcher()
	buildBoard()
})
</script>

<style lang="scss">
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';

.vue-flow__background pattern {
	transform: translate3d(1.25px, 1.25px, 0px);
}

.vue-flow__minimap {
	transform: scale(75%);
	transform-origin: bottom right;
}

:root {
	--vf-node-bg: #fff;
	--vf-node-text: #fff;
	--vf-connection-path: #b1b1b7;
	--vf-handle: #555;
}

.basicflow.dark .vue-flow__node {
	.vue-flow__pane {
		background: #1c1d1f;
	}
}

.vue-flow__node.vue-flow__node-custom {
	border: 1px solid transparent;
	padding: 5px;
	border-radius: 10px;
	background: transparent;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	gap: 10px;
	max-width: 250px;
}

.basicflow.dark .vue-flow__controls .vue-flow__controls-button {
	fill: #fffffb;
	border-color: #fffffb;
}

.basicflow .controls {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 8px;
}

.basicflow .controls button {
	padding: 4px;
	border-radius: 5px;
	font-weight: 600;
	-webkit-box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3);
	box-shadow: 0 5px 10px #0000004d;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
}

.basicflow .controls button:hover {
	transform: scale(102%);
	transition: 0.25s all ease;
}

.vue-flow__node-custom {
	border: 1px solid #777;
	padding: 10px;
	border-radius: 10px;
	background: whitesmoke;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	gap: 10px;
	max-width: 250px;
}

.customnodeflow button {
	padding: 5px;
	width: 25px;
	height: 25px;
	border-radius: 25px;
	-webkit-box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3);
	box-shadow: 0 5px 10px #0000004d;
	cursor: pointer;
}

.customnodeflow button:hover {
	opacity: 0.9;
	transform: scale(105%);
	transition: 0.25s all ease;
}

.vue-flow__nodesselection-rect,
.vue-flow__selection {
	background-color: hsla(26, 91%, 71%, 0.15);
	@apply border rounded border-prime border-dashed;
}

.vue-flow__node {
	@apply transition-all duration-150 ease-out;
}
.isPressed {
	.vue-flow__node {
		@apply transition-none duration-0;
	}
}
</style>
