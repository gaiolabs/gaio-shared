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
			:min-zoom="0.2"
			:max-zoom="4"
			:snap-to-grid="true"
			:snap-grid="[5, 5]"
			selection-mode="partial"
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

		<BoardHeader
			v-if="elements"
			:elements="elements"
			@open="$emit('choose', $event)"
		/>
		<aside class="z-1 absolute bottom-0 right-0 p-4 flex flex-col items-end gap-2">
			<AlignmentToolbar :get-selected-nodes="getSelectedNodes" />

			<GCard
				type="wrapper"
				class="flex rounded-xl px-1"
			>
				<GButton
					size="tiny"
					type="tertiary"
					class="!p-2"
					@click="organizeDagreLayout('LR')"
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
					@click="fitView()"
				>
					<IconComponent name="AdjustToScreen" />
				</GButton>
			</GCard>
		</aside>
	</div>
</template>

<script setup lang="ts">
import GCard from '@/components/GCard.vue'
import GButton from '@/components/inputs/GButton.vue'
import useApi from '@/composables/useApi'
import useHelper from '@/composables/useHelper'
import { useAppStore } from '@/stores'
import { useJobStore } from '@/stores/useJobStore'
import BoardNode from '@/views/studio/board/BoardNode.vue'
import AlignmentToolbar from '@/views/studio/board/toolbars/AlignmentToolbar.vue'
import BoardHeader from '@/views/studio/StudioHeader.vue'
import { Background } from '@vue-flow/background'
import { isNode, Position, useVueFlow, VueFlow, getRectOfNodes } from '@vue-flow/core'
import type { Elements } from '@vue-flow/core'
import { useDark, usePointer } from '@vueuse/core'
import dagre from 'dagre'
import { debounce } from 'lodash-es'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

const { onConnect, addEdges, nodes, edges, getSelectedNodes, setViewport, getNodes } = useVueFlow()
const emit = defineEmits(['choose', 'open'])
const showBoard = ref(true)
const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))
let elements = ref<Elements>([])
const localNodes = ref()
const localEdges = ref()
const isDark = useDark()

const selectMany = ref([])

const onOpenNode = (ev) => {
	emit('open', ev.node.data)
}

const onSelectMany = () => {
	// console.log(JSON.stringify(getSelectedNodes.value, null, 2))
	useAppStore().task = null
	selectMany.value = getSelectedNodes.value
}

const onSelectNode = (ev) => {
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

function fitView() {
	const nodes = getNodes.value

	if (nodes.length === 0) return

	// Get the bounding box of all nodes
	const nodesBoundingBox = getRectOfNodes(nodes)

	// Define paddings (in pixels)
	const paddingLeft = 350 // Adjust as needed
	const paddingRight = 40 // Adjust as needed
	const paddingTop = 75 // Adjust as needed
	const paddingBottom = 40 // Adjust as needed

	// Apply custom padding
	nodesBoundingBox.x -= paddingLeft
	nodesBoundingBox.y -= paddingTop
	nodesBoundingBox.width += paddingLeft + paddingRight
	nodesBoundingBox.height += paddingTop + paddingBottom

	// Get the size of the VueFlow container
	const viewportWidth = graph.value.$el.clientWidth
	const viewportHeight = graph.value.$el.clientHeight

	// Compute the zoom level needed to fit the bounding box into the viewport
	const zoomX = viewportWidth / nodesBoundingBox.width
	const zoomY = viewportHeight / nodesBoundingBox.height
	let zoom = Math.min(zoomX, zoomY)

	// Limit the zoom to the maximum zoom allowed
	const maxZoom = 1 // Adjust maxZoom as needed
	zoom = Math.min(zoom, maxZoom)

	// Compute the pan (translation) needed to center the bounding box in the viewport
	const x = -nodesBoundingBox.x * zoom + (viewportWidth - nodesBoundingBox.width * zoom) / 2
	const y = -nodesBoundingBox.y * zoom + (viewportHeight - nodesBoundingBox.height * zoom) / 2

	// Apply the transformation to the VueFlow instance
	setViewport({ x, y, zoom }, { duration: 600 })
}

const organizeDagreLayout = (direction: string) => {
	const before = JSON.stringify(elements.value)
	const isHorizontal = direction === 'LR'

	// Clear existing nodes and edges from the dagre graph
	dagreGraph.nodes().forEach((node) => dagreGraph.removeNode(node))
	dagreGraph.edges().forEach((edge) => dagreGraph.removeEdge(edge, edge.v, edge.w))

	// Set up the dagre graph with appropriate settings
	dagreGraph.setGraph({
		rankdir: direction,
		align: 'UL',
		marginx: 0,
		marginy: 0,
	})

	// Add nodes and edges to the dagre graph
	elements.value.forEach((el) => {
		if (isNode(el)) {
			// Set node dimensions; adjust width and height as needed
			dagreGraph.setNode(el.id, { width: 180, height: 60 })
		} else {
			// Set edges between nodes
			dagreGraph.setEdge(el.source, el.target)
		}
	})

	// Run the dagre layout algorithm
	dagre.layout(dagreGraph)

	// Update element positions based on layout
	elements.value.forEach((el) => {
		if (isNode(el)) {
			const nodeWithPosition = dagreGraph.node(el.id)

			// Set node handle positions based on layout direction
			el.targetPosition = isHorizontal ? Position.Left : Position.Top
			el.sourcePosition = isHorizontal ? Position.Right : Position.Bottom

			// Snap positions to grid steps of 5
			el.position = {
				x: Math.round(nodeWithPosition.x / 5) * 5,
				y: Math.round(nodeWithPosition.y / 5) * 5,
			}
		}
	})

	// Adjust parent nodes to be vertically centered over their children
	adjustParentPositions(isHorizontal)

	// Wait for the next tick to render and fit the view
	nextTick(() => {
		fitView()
	})
}

// Helper function to adjust parent positions
const adjustParentPositions = (isHorizontal) => {
	// Build a mapping from parent nodes to their immediate children
	const parentToChildrenMap = {}

	// Map each parent node to its children
	elements.value.forEach((el) => {
		if (!isNode(el)) {
			const parent = el.source
			const child = el.target

			if (!parentToChildrenMap[parent]) {
				parentToChildrenMap[parent] = []
			}
			parentToChildrenMap[parent].push(child)
		}
	})

	// Adjust each parent node's position based on its children's positions
	Object.keys(parentToChildrenMap).forEach((parentId) => {
		const childrenIds = parentToChildrenMap[parentId]
		const childNodes = elements.value.filter((el) => isNode(el) && childrenIds.includes(el.id))

		// Calculate the average position of the children
		const avgPosition = childNodes.reduce(
			(sum, child) => ({
				x: sum.x + child.position.x,
				y: sum.y + child.position.y,
			}),
			{ x: 0, y: 0 },
		)

		avgPosition.x /= childNodes.length
		avgPosition.y /= childNodes.length

		// Find the parent node
		const parentNode = elements.value.find((el) => isNode(el) && el.id === parentId)

		if (parentNode) {
			// Adjust parent's position based on layout direction
			if (isHorizontal) {
				// For horizontal layout (LR), adjust y position to average y of children
				parentNode.position.y = Math.round(avgPosition.y / 5) * 5
			} else {
				// For vertical layout (TB), adjust x position to average x of children
				parentNode.position.x = Math.round(avgPosition.x / 5) * 5
			}

			// Check for conflicts and resolve them
			resolveConflicts(parentNode, isHorizontal)
		}
	})
}

// Helper function to resolve conflicts
const resolveConflicts = (movedNode, isHorizontal) => {
	const maxSteps = 10 // Limit to 10 steps
	const nodeSize = { width: 180, height: 60 }
	const spacing = 20 // Minimum spacing between nodes

	let steps = 0

	while (steps < maxSteps) {
		let conflictFound = false

		// Check for conflicts with other nodes
		for (let el of elements.value) {
			if (isNode(el) && el.id !== movedNode.id) {
				if (nodesOverlap(movedNode, el, nodeSize, spacing)) {
					// Conflict found, move the conflicting node down or sideways
					conflictFound = true
					steps++

					if (isHorizontal) {
						// Move down vertically
						el.position.y += nodeSize.height + spacing
					} else {
						// Move sideways horizontally
						el.position.x += nodeSize.width + spacing
					}

					// Snap to grid
					el.position.x = Math.round(el.position.x / 5) * 5
					el.position.y = Math.round(el.position.y / 5) * 5

					// Break to re-check from the beginning
					break
				}
			}
		}

		// If no conflicts found, exit the loop
		if (!conflictFound) {
			break
		}
	}
}

// Helper function to check if two nodes overlap
const nodesOverlap = (nodeA, nodeB, nodeSize, spacing) => {
	const rectA = {
		left: nodeA.position.x,
		right: nodeA.position.x + nodeSize.width,
		top: nodeA.position.y,
		bottom: nodeA.position.y + nodeSize.height,
	}

	const rectB = {
		left: nodeB.position.x,
		right: nodeB.position.x + nodeSize.width,
		top: nodeB.position.y,
		bottom: nodeB.position.y + nodeSize.height,
	}

	// Check for overlap with spacing buffer
	return !(
		rectA.right + spacing <= rectB.left ||
		rectA.left - spacing >= rectB.right ||
		rectA.bottom + spacing <= rectB.top ||
		rectA.top - spacing >= rectB.bottom
	)
}

const currentFlowId = computed(() => {
	return useAppStore().flow?.flowId
})
const useJob = useJobStore()

const graph = ref()
const pointer = usePointer()
const isPressed = computed(() => {
	return pointer.pressure.value > 0
})

const currentFlow = computed(() => useAppStore().flow)

const buildBoard = () => {
	nextTick(() => {
		localEdges.value = []
		localNodes.value = []
		elements.value = []
		processBoard()
	})
}

const processBoard = () => {
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
		nextTick(() => {
			fitView()
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
