<template>
	<aside
		id="sidebar-param"
		class="flex h-full flex-col items-stretch p-3 gap-3"
	>
		<header class="flex w-full items-stretch justify-between">
			<h2 class="text-lg font-bold inline-flex gap-1 items-center">
				<IconComponent name="Params" />
				<span>
					{{ $t('parameters') }}
				</span>
			</h2>

			<div class="flex">
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
					@click="
						current = {
							paramName: '',
							paramDescription: '',
							paramValue: '',
						}
					"
				>
					<template #icon>
						<IconComponent name="AddItem" />
					</template>
				</NButton>

				<NButton
					size="tiny"
					quaternary
					@click="useAppStore().saveAppMetadata('params')"
				>
					<template #icon>
						<IconComponent name="Save" />
					</template>
				</NButton>
			</div>
		</header>

		<GCard class="flex grow flex-col overflow-hidden rounded-2xl p-2">
			<NScrollbar
				style="height: 100%; overflow: auto"
				outer-class="h-full overflow-auto"
			>
				<div v-if="localTreeFiltered(localTree, searchTerm).length">
					<NTree
						block-node
						block-line
						draggable
						expand-on-click
						expand-on-dragenter
						:get-children="baseChildren"
						:data="localTreeFiltered(localTree, searchTerm)"
						:node-props="treeNodeActions"
						:render-switcher-icon="removeRenderSwitcherIcon"
						:render-label="renderLabel"
						:default-expand-all="searchTerm.length > 0"
						@drop="handleDropThenUpdate"
					/>
				</div>
			</NScrollbar>
		</GCard>

		<sidebar-param-control
			v-if="current"
			:param="current"
			@close="closeParamControl()"
		/>
	</aside>
</template>

<script setup lang="ts">
import GCard from '@/components/GCard.vue'
import IconComponent from '@/components/icons/IconComponent.vue'
import useApi from '@/composables/useApi'
import useTree from '@/composables/useTree'
import { useAppStore } from '@/stores'
import SidebarParamControl from '@/views/studio/sidebar/sidebar-param/SidebarParamControl.vue'
import type { AppFolderOption, ParamType } from '@gaio/shared/types'
import { NButton, type TreeOption } from 'naive-ui'
import { computed, h, onMounted, ref } from 'vue'
import SidebarParamItem from './SidebarParamLabel.vue'

const {
	handleDrop,
	baseChildren,
	removeRenderSwitcherIcon,
	baseParamTreeSchema,
	baseFolderTreeSchema,
	localTreeFiltered,
} = useTree()

const newFolderName = ref('')
const addNewFolder = () => {
	if (!newFolderName.value) {
		return
	}
	localTree.value.push(baseFolderTreeSchema(newFolderName.value))
	newFolderName.value = ''

	updateAppFolderOptions()
}

const searchTerm = ref('')
const current = ref<ParamType>(null)
const localTree = ref<TreeOption[]>([])
const handleDropThenUpdate = (e) => {
	localTree.value = handleDrop(e, localTree.value)
	updateAppFolderOptions()
}

const closeParamControl = () => {
	current.value = null
	constructLocalTree()
}

const renderLabel = ({ option }) => {
	return h(SidebarParamItem, {
		option,
		onEdit: (param) => {
			current.value = param
		},
	})
}

const treeNodeActions = () => {
	return {
		onClick() {
			// openControl(useAppStore().params.find((o) => o.paramName === option.key))
		},
		// onContextmenu(e: MouseEvent) {
		//     e.preventDefault()
		//     e.stopPropagation()
		//
		//     if (option.children && option.children.length > 0) {
		//         showDropdown.value = false
		//         message.info(t('deleteIfEmptyFolder'))
		//         return
		//     } else {
		//         optionsRef.value = [
		//             {
		//                 label: t('delete') + ': ' + option.label,
		//                 key: 'delete',
		//                 reference: option.key
		//             }
		//         ]
		//         showDropdown.value = true
		//         x.value = e.clientX
		//         y.value = e.clientY
		//     }
		// }
	}
}

const params = computed(() => {
	return useAppStore().params
})

const constructLocalTree = () => {
	localTree.value = []

	const flowItems = params.value.reduce((acc, flow) => {
		acc[flow.paramName] = flow
		return acc
	}, {})

	const buildTree = (appFolderOptions: AppFolderOption[]): TreeOption[] => {
		return appFolderOptions
			.filter((appFolderOption) => (!appFolderOption.isLeaf ? true : flowItems[appFolderOption.label]))
			.map((appFolderOption) => {
				let treeOption: TreeOption

				if (appFolderOption.isLeaf) {
					const flow = flowItems[appFolderOption.label]

					if (flow) {
						treeOption = baseParamTreeSchema(flow)
					}
				} else {
					if (appFolderOption?.label) {
						treeOption = baseFolderTreeSchema(appFolderOption.label)
					}
				}

				delete flowItems[appFolderOption.label]

				if (appFolderOption.children) {
					treeOption.children = buildTree(appFolderOption.children)
				}

				return treeOption
			})
			.filter((o) => o.label)
	}

	localTree.value = buildTree(useAppStore().app.options.folderParam || [])

	for (let lastFlow of Object.keys(flowItems)) {
		localTree.value.push(baseParamTreeSchema(flowItems[lastFlow]))
	}
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
				folderParam: appFolderList,
			},
			appId: useAppStore().app.appId,
		},
	})
}

onMounted(() => constructLocalTree())
</script>

<style lang="scss">
.sidebar-param {
	.n-tree-node-switcher {
		width: 10px !important;
	}
}
</style>
