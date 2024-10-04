<template>
	<div
		id="board-view"
		class="w-full h-full"
	>
		<VueFlow
			v-if="showBoard"
			ref="graph"
			v-model="elements"
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
		<div class="z-1 absolute bottom-0 right-0 p-2 py-3">
			<GCard
				class="sidebar-sub-nav core-shadow-2 bottom-[10px] flex h-[40px] items-center gap-3 rounded-[10px] border-elevation-2 bg-elevation-1 px-3"
			>
				<div class="flex items-center gap-2">
					<NButton
						size="tiny"
						@click="organizeDagreLayout('LR')"
					>
						<template #icon>
							<IconComponent
								class="rotate-[-90deg]"
								name="Studio"
							/>
						</template>
					</NButton>
					<NButton
						size="tiny"
						@click="fitView()"
					>
						<template #icon>
							<GIcon name="full" />
						</template>
					</NButton>
				</div>
			</GCard>
		</div>
	</div>
</template>

<script setup lang="ts">
import useApi from '@/composables/useApi'
import useHelper from '@/composables/useHelper'
import { useAppStore } from '@/stores'
import { useJobStore } from '@/stores/useJobStore'
import BoardHeader from '@/views/studio/canvas/board-view/BoardHeader.vue'
import BoardNode from '@/views/studio/canvas/board-view/BoardNode.vue'
import { Background } from '@vue-flow/background'
import { isNode, Position, useVueFlow, VueFlow } from '@vue-flow/core'
import type { Elements } from '@vue-flow/core'
import { useDark } from '@vueuse/core'
import dagre from 'dagre'
import { debounce } from 'lodash-es'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

const { onConnect, addEdges, fitView, nodes, edges, getSelectedNodes } = useVueFlow()
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
	console.log(JSON.stringify(getSelectedNodes.value, null, 2))
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

const organizeDagreLayout = (direction: string) => {
	showBoard.value = false
	const isHorizontal = direction === 'LR'
	dagreGraph.setGraph({ rankdir: direction, align: 'UL', marginx: 10, marginy: 55 })

	elements.value.forEach((el) => {
		if (isNode(el)) {
			dagreGraph.setNode(el.id, { width: 200, height: 40 })
		} else {
			dagreGraph.setEdge(el.source, el.target)
		}
	})

	dagre.layout(dagreGraph)

	elements.value.forEach((el) => {
		if (isNode(el)) {
			const nodeWithPosition = dagreGraph.node(el.id)
			el.targetPosition = isHorizontal ? Position.Left : Position.Top
			el.sourcePosition = isHorizontal ? Position.Right : Position.Bottom
			el.position = { x: nodeWithPosition.x, y: nodeWithPosition.y }
		}
	})
	showBoard.value = true
}

const currentFlowId = computed(() => {
	return useAppStore().flow?.flowId
})
const useJob = useJobStore()

const graph = ref()

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
</style>
