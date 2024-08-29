<template>
	<div class="sidebar-param flex h-[100%] flex-col items-stretch pt-3">
		<div class="flex w-full items-stretch justify-between px-4">
			<div class="text-lg font-bold">{{ $t('forms') }}</div>
			<div class="flex">
				<n-popover
					placement="bottom"
					trigger="click"
				>
					<template #trigger>
						<n-button
							size="tiny"
							quaternary
						>
							<template #icon>
								<g-icon name="createFolder" />
							</template>
						</n-button>
					</template>
					<div>
						{{ $t('folder') }}
						<n-input
							v-model:value="newFolderName"
							:placeholder="$t('typeHere')"
						>
							<template #suffix>
								<n-button
									size="tiny"
									text
									@click="addNewFolder"
								>
									{{ $t('add') }}
								</n-button>
							</template>
						</n-input>
					</div>
				</n-popover>
				<n-tooltip>
					<template #trigger>
						<n-button
							size="tiny"
							quaternary
							@click="selectForm({})"
						>
							<template #icon>
								<g-icon name="add" />
							</template>
						</n-button>
					</template>
					{{ $t('newForm') }}
				</n-tooltip>
			</div>
		</div>
		<div class="my-3 flex grow flex-col items-stretch overflow-hidden">
			<div class="control sidebar-flow-search px-3 pt-1">
				<n-input
					v-model:value="searchTerm"
					size="small"
					:placeholder="$t('search')"
				/>
			</div>
			<n-scrollbar
				style="calc(100% - 20px) overflow: auto"
				outer-class="h-full overflow-auto"
			>
				<div
					v-if="localTreeFiltered(localTree, searchTerm).length"
					class="px-2"
				>
					<n-tree
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
			</n-scrollbar>
		</div>
	</div>
</template>

<script setup lang="ts">
import useTree from '@/composables/useTree'
import { useAppStore, useFormStore } from '@/stores'
import SidebarFormLabel from '@/views/studio/canvas/sidebar/sidebar-form/SidebarFormLabel.vue'
import SidebarFormMore from '@/views/studio/canvas/sidebar/sidebar-form/SidebarFormMore.vue'
import type { FormType, ParamType } from '@gaio/shared/types'
import { NButton, type TreeOption } from 'naive-ui'
import { h, onMounted, ref } from 'vue'

const emit = defineEmits(['choose'])
const {
	handleDrop,
	baseChildren,
	removeRenderSwitcherIcon,
	constructLocalTree,
	localTreeFiltered,
	updateAppFolderOptions,
	baseFolderTreeSchema
} = useTree()

const selectForm = (item: FormType) => {
	useFormStore().current = item
	emit('choose', { type: 'form' })
}

const newFolderName = ref('')
const current = ref<ParamType>()
const searchTerm = ref('')
const localTree = ref<TreeOption[]>([])

const addNewFolder = () => {
	if (!newFolderName.value) {
		return
	}
	localTree.value.push(baseFolderTreeSchema(newFolderName.value))
	newFolderName.value = ''

	updateAppFolderOptions(localTree.value, 'folderForm')
	useAppStore().saveAppMetadata('forms')
}

const handleDropThenUpdate = (e) => {
	localTree.value = handleDrop(e, localTree.value)
	updateAppFolderOptions(localTree.value, 'folderForm')
	useAppStore().saveAppMetadata('forms')
}

const renderLabel = ({ option }) => {
	return h(SidebarFormLabel, { option, onChoose: (ev) => emit('choose', ev) })
}

const openControl = (flow) => {
	current.value = flow
}

const baseFormTreeSchema = (data) => {
	return {
		key: data.formId,
		label: data.formName,
		isLeaf: true,
		suffix: () =>
			h(SidebarFormMore, {
				onChoose: (ev) => emit('choose', ev),
				onEdit: (ev) => selectForm(ev),
				formId: data.formId
			})
	} as TreeOption
}

const treeNodeActions = () => {
	return {
		onClick() {
			// console.log('select param', option)
		}
	}
}

onMounted(
	() =>
		(localTree.value = constructLocalTree({
			baseList: useAppStore().forms,
			baseListIdReference: 'formId',
			folderName: 'folderForm',
			localTree: localTree.value,
			baseTreeSchema: baseFormTreeSchema,
			openControl
		}))
)
</script>

<style lang="scss">
.sidebar-form {
	.n-tree-node-switcher {
		width: 10px !important;
	}
}
</style>
