<template>
    <div class="sidebar-param flex h-[100%] flex-col items-stretch pt-3">
        <div class="flex w-full items-stretch justify-between px-4">
            <div class="text-lg font-bold">{{ $t('parameters') }}</div>
            <div class="flex">
                <n-popover placement="bottom" trigger="click">
                    <template #trigger>
                        <n-button size="tiny" quaternary>
                            <template #icon>
                                <g-icon name="createFolder" />
                            </template>
                        </n-button>
                    </template>
                    <div>
                        {{ $t('folder') }}
                        <n-input v-model:value="newFolderName" :placeholder="$t('typeHere')">
                            <template #suffix>
                                <n-button size="tiny" text @click="addNewFolder">
                                    {{ $t('add') }}
                                </n-button>
                            </template>
                        </n-input>
                    </div>
                </n-popover>
                <n-button size="tiny" quaternary @click="current = {}">
                    <template #icon>
                        <g-icon name="add" />
                    </template>
                </n-button>
                <n-button size="tiny" quaternary @click="useAppStore().saveAppMetadata('params')">
                    <template #icon>
                        <g-icon name="save" />
                    </template>
                </n-button>
            </div>
        </div>
        <div class="my-3 flex grow flex-col items-stretch overflow-hidden">
            <div class="mx-3">
                <n-scrollbar style="height: 100%; overflow: auto" outer-class="h-full overflow-auto">
                    <div v-if="localTreeFiltered(localTree, searchTerm).length" class="px-2">
                        <n-tree block-node block-line draggable expand-on-click expand-on-dragenter
                            :get-children="baseChildren" :data="localTreeFiltered(localTree, searchTerm)"
                            :node-props="treeNodeActions" :render-switcher-icon="removeRenderSwitcherIcon"
                            :render-label="renderLabel" :default-expand-all="searchTerm.length > 0"
                            @drop="handleDropThenUpdate" />
                    </div>
                </n-scrollbar>
            </div>
        </div>
        <sidebar-param-control v-if="current" :param="current" @close="closeParamControl()" />
    </div>
</template>

<script setup lang="ts">
import type { AppFolderOption, ParamType } from '@gaio/shared/types'
import { NButton, type TreeOption } from 'naive-ui'
import { computed, h, onMounted, ref } from 'vue'

import useApi from '@/composables/useApi'
import useTree from '@/composables/useTree'
import { useAppStore } from '@/stores'
import SidebarParamControl from '@/views/studio/canvas/sidebar/sidebar-param/SidebarParamControl.vue'

import SidebarParamItem from './SidebarParamLabel.vue'

const {
    handleDrop,
    baseChildren,
    removeRenderSwitcherIcon,
    baseParamTreeSchema,
    baseFolderTreeSchema,
    localTreeFiltered
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
const current = ref<ParamType>()
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
        }
    })
}

const treeNodeActions = () => {
    return {
        onClick() {
            // openControl(useAppStore().params.find((o) => o.paramName === option.key))
        }
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
                isLeaf: !!node.isLeaf
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
                folderParam: appFolderList
            },
            appId: useAppStore().app.appId
        }
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
