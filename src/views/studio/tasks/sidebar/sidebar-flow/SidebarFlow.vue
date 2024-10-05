<template>
	<aside
		id="sidebar-flow"
		class="flex h-full flex-col items-stretch p-3 gap-3"
	>
		<header class="flex flex-col gap-3">
			<nav class="flex w-full items-stretch justify-between">
				<h2 class="text-lg font-bold inline-flex items-center gap-1">
					<IconComponent
						name="Studio"
						class="rotate-[-90deg]"
					/>
					<span>
						{{ $t('flow') }}
					</span>
				</h2>
				<div class="flex">
					<NButton
						size="tiny"
						quaternary
						@click="showScheduleBulk = true"
					>
						<template #icon>
							<IconComponent name="CronEdit" />
						</template>
					</NButton>
					<NPopover
						placement="bottom"
						trigger="click"
					>
						<template #trigger>
							<NButton
								size="tiny"
								quaternary
							>
								<template #icon>
									<IconComponent name="CreateFolder" />
								</template>
							</NButton>
						</template>
						<div>
							{{ $t('folder') }}
							<NInput
								v-model:value="newFolderName"
								:placeholder="$t('typeHere')"
							>
								<template #suffix>
									<NButton
										size="tiny"
										text
										@click="addNewFolder"
									>
										{{ $t('add') }}
									</NButton>
								</template>
							</NInput>
						</div>
					</NPopover>
					<NButton
						size="tiny"
						quaternary
						@click="currentFlow = {}"
					>
						<template #icon>
							<IconComponent name="AddItem" />
						</template>
					</NButton>
				</div>
			</nav>
			<div class="sidebar-flow-search">
				<NInput
					v-model:value="searchTerm"
					size="small"
					:placeholder="$t('search')"
				/>
			</div>
		</header>
		<GCard class="flex grow flex-col overflow-hidden rounded-2xl">
			<flow-control
				v-if="currentFlow"
				:flow="currentFlow"
				@save="initSidebarFlow()"
				@close="currentFlow = null"
			/>
			<flow-control-schedule-bulk
				v-if="showScheduleBulk"
				@close="showScheduleBulk = false"
			/>
			<NDropdown
				trigger="manual"
				:show="showDropdown"
				:options="optionsRef as any"
				:x="x"
				:y="y"
				@select="handleSelectDelete"
				@clickoutside="showDropdown = false"
			/>
			<NScrollbar
				style="height: 100%; overflow: auto"
				outer-class="h-full overflow-auto"
			>
				<div class="px-2">
					<NTree
						block-node
						block-line
						draggable
						expand-on-click
						expand-on-dragenter
						:get-children="baseChildren"
						:data="localTreeFiltered"
						:node-props="nodeProps"
						:render-switcher-icon="removeRenderSwitcherIcon"
						:default-expand-all="searchTerm.length > 0"
						@drop="handleDropThenUpdate"
					/>
				</div>
			</NScrollbar>
		</GCard>
	</aside>
</template>

<script setup lang="ts">
import IconComponent from '@/components/icons/IconComponent.vue'
import useApi from '@/composables/useApi'
import useTree from '@/composables/useTree'
import { useAppStore } from '@/stores'
import FlowControl from '@/views/studio/tasks/sidebar/sidebar-flow/FlowControl.vue'
import FlowControlScheduleBulk from '@/views/studio/tasks/sidebar/sidebar-flow/FlowControlScheduleBulk.vue'
import type { AppFolderOption, FlowType } from '@gaio/shared/types'
import { intersection } from 'lodash-es'
import { type DropdownOption, NButton, type TreeOption, useMessage } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const showScheduleBulk = ref(false)

const currentFlow = ref<Partial<FlowType> | null>(null)
const x = ref(0)
const y = ref(0)
const optionsRef = ref<DropdownOption[]>([])
const localTree = ref<TreeOption[]>([])
const flowList = ref<FlowType[]>([])
const showDropdown = ref(false)
const searchTerm = ref('')
const newFolderName = ref('')
const message = useMessage()

const { handleDrop, removeRenderSwitcherIcon, baseChildren, baseFlowTreeSchema, baseFolderTreeSchema } = useTree()

const handleSelectDelete = (_, base) => {
	showDropdown.value = false
	const reference = base.reference

	const walkAndDelete = (tree: TreeOption[]) => {
		for (let i = 0; i < tree.length; ++i) {
			const node = tree[i]
			if (node.key === reference) {
				tree.splice(i, 1)
				return true
			}
			if (node.children) {
				const found = walkAndDelete(node.children)
				if (found) return true
			}
		}
		return false
	}

	walkAndDelete(localTree.value)
	updateAppFolderOptions()
}

const addNewFolder = () => {
	if (!newFolderName.value) {
		return
	}
	localTree.value.push(baseFolderTreeSchema(newFolderName.value))
	newFolderName.value = ''

	updateAppFolderOptions()
}

const localTreeFiltered = computed(() => {
	const filterTree = (tree: TreeOption[], searchTerm: string) => {
		return tree.filter((node) => {
			if (node.label.toLowerCase().includes(searchTerm.toLowerCase())) {
				return true
			}
			if (node.children) {
				node.children = filterTree(node.children, searchTerm)
				return node.children.length > 0
			}
			return false
		})
	}

	return filterTree(localTree.value, searchTerm.value)
})

const handleDropThenUpdate = (e) => {
	localTree.value = handleDrop(e, localTree.value)
	updateAppFolderOptions()
}

const updateAppFolderOptions = () => {
	const buildAppFolder = (tree: TreeOption[]): AppFolderOption[] => {
		return tree.map((node) => {
			const appFolder: AppFolderOption = {
				label: node.isLeaf ? `${node.key}` : node.label,
				isLeaf: !!node.isLeaf,
			}
			if (node.children) {
				appFolder.children = buildAppFolder(node.children)
			}
			return appFolder
		})
	}

	const appFolderList = buildAppFolder(localTree.value)

	useApi().post('api/app/update-options', {
		body: {
			options: {
				...useAppStore().app.options,
				folderFlow: appFolderList,
			},
			appId: useAppStore().app.appId,
		},
	})
}

const nodeProps = ({ option }: { option: TreeOption }) => {
	return {
		onClick() {
			selectFlow(option)
		},
		onContextmenu(e: MouseEvent) {
			e.preventDefault()
			e.stopPropagation()

			if (option.children && option.children.length > 0) {
				showDropdown.value = false
				message.info(t('deleteIfEmptyFolder'))
				return
			} else {
				optionsRef.value = [
					{
						label: t('delete') + ': ' + option.label,
						key: 'delete',
						reference: option.key,
					},
				]
				showDropdown.value = true
				x.value = e.clientX
				y.value = e.clientY
			}
		},
	}
}

const selectFlow = (option) => {
	if (option.isLeaf) useAppStore().defineCurrentFlow(option.key as string)
}

const openFlowControl = (flow) => {
	currentFlow.value = flow
}

const constructLocalTree = () => {
	localTree.value = []

	const flowItems = flowList.value.reduce((acc, flow) => {
		acc[flow.flowId] = flow
		return acc
	}, {})

	// todo - need to remove label build tree reference when a flow is deleted
	const buildTree = (appFolderOptions: AppFolderOption[]): TreeOption[] => {
		return appFolderOptions
			.map((appFolderOption) => {
				let treeOption: TreeOption

				if (appFolderOption.isLeaf) {
					const flow = flowItems[appFolderOption.label]
					if (!flow) {
						treeOption = baseFlowTreeSchema(flow, openFlowControl)
					}
				} else {
					treeOption = baseFolderTreeSchema(appFolderOption.label)
				}

				delete flowItems[appFolderOption.label]

				if (appFolderOption.children) {
					treeOption.children = buildTree(appFolderOption.children)
				}
				return treeOption
			})
			.filter((o) => o.label)
	}

	localTree.value = buildTree(useAppStore().app.options.folderFlow || [])

	for (let lastFlow of Object.keys(flowItems)) {
		localTree.value.push(baseFlowTreeSchema(flowItems[lastFlow], openFlowControl))
	}
}

const initSidebarFlow = () => {
	currentFlow.value = null
	flowList.value = useAppStore().flowList || []
	constructLocalTree()
}

onMounted(() => initSidebarFlow())
</script>

<style lang="scss">
.sidebar-flow {
	.n-tree-node-switcher {
		width: 10px !important;
	}
}
</style>
