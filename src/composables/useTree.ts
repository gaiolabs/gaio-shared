import type { AppFolderOption, ParamType } from '@gaio/types'
import { getId } from '@gaio/utils'
import type { TreeDropInfo, TreeOption } from 'naive-ui'
import { NButton } from 'naive-ui'
import { h } from 'vue'

import VIcon from '@/components/GIcon.vue'
import { useAppStore } from '@/stores'

export default () => {
    const baseFolderTreeSchema = (label: string) => {
        return {
            key: getId(),
            label,
            isLeaf: false,
            prefix: () =>
                h(VIcon, {
                    name: 'folder'
                })
        } as TreeOption
    }

    const updateAppFolderOptions = async (localTree: TreeOption[], folderName: string) => {
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

        const appFolderList = buildAppFolder(localTree)

        await useAppStore().saveAppOptions({ [folderName]: appFolderList })
    }

    const localTreeFiltered = (localTree, searchTerm) => {
        const filterTree = (tree: TreeOption[], term = '') => {
            return tree.filter((node) => {
                if (node.label && node.label.toLowerCase().includes(term.toLowerCase())) {
                    return true
                }
                if (node.children) {
                    node.children = filterTree(node.children, term)
                    return node.children.length > 0
                }
                return false
            })
        }

        return filterTree(localTree, searchTerm)
    }

    const baseParamTreeSchema = (flowData: ParamType) => {
        return {
            key: flowData.paramName,
            label: flowData.paramName,
            value: flowData.paramValue,
            isLeaf: true
        } as TreeOption
    }

    const baseFlowTreeSchema = (flowData, openFlowControl) => {
        return {
            key: flowData.flowId,
            label: flowData.flowName,
            isLeaf: true,
            flowType: flowData.flowType,
            suffix: () =>
                h(
                    NButton,
                    { text: true, onClick: () => openFlowControl(flowData) },
                    {
                        default: () =>
                            h(VIcon, {
                                name: 'pencil'
                            })
                    }
                ),
            prefix: () =>
                flowData.flowType === 'infoPub' ?
                    flowData.options.dashboardType === 'page' ?
                        h(VIcon, {
                            color: '#e32',
                            name: 'dashboard'
                        })
                    :   h(VIcon, {
                            color: '#e32',
                            name: 'dialog'
                        })
                :   h(VIcon, {
                        color: '#216ec9',
                        name: 'flow'
                    })
        } as TreeOption
    }

    const baseChildren = (e) => {
        if (e.children && e.children.length > 0) {
            return e.children
        }
        return []
    }

    function findSiblingsAndIndex(node: TreeOption, nodes?: TreeOption[]): [TreeOption[], number] | [null, null] {
        if (!nodes) return [null, null]
        for (let i = 0; i < nodes.length; ++i) {
            const siblingNode = nodes[i]
            if (siblingNode.key === node.key) return [nodes, i]
            const [siblings, index] = findSiblingsAndIndex(node, siblingNode.children)
            if (siblings && index !== null) return [siblings, index]
        }
        return [null, null]
    }

    const handleDrop = ({ node, dragNode, dropPosition }: TreeDropInfo, localTree: TreeOption[]) => {
        const [dragNodeSiblings, dragNodeIndex] = findSiblingsAndIndex(dragNode, localTree)
        if (dragNodeSiblings === null || dragNodeIndex === null) return
        dragNodeSiblings.splice(dragNodeIndex, 1)
        if (dropPosition === 'inside') {
            if (node.children) {
                node.children.unshift(dragNode)
            } else {
                node.children = [dragNode]
            }
        } else if (dropPosition === 'before') {
            const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(node, localTree)
            if (nodeSiblings === null || nodeIndex === null) return
            nodeSiblings.splice(nodeIndex, 0, dragNode)
        } else if (dropPosition === 'after') {
            const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(node, localTree)
            if (nodeSiblings === null || nodeIndex === null) return
            nodeSiblings.splice(nodeIndex + 1, 0, dragNode)
        }
        return Array.from(localTree)
    }

    const removeRenderSwitcherIcon = () => {
        return ''
    }

    const constructLocalTree = ({
        baseList,
        localTree,
        baseListIdReference,
        folderName,
        baseTreeSchema,
        openControl
    }) => {
        const baseItems = baseList.reduce((acc, f) => {
            acc[f[baseListIdReference]] = f
            return acc
        }, {})

        const buildTree = (appFolderOptions: AppFolderOption[]): TreeOption[] => {
            return appFolderOptions
                .filter((appFolderOption) => (!appFolderOption.isLeaf ? true : baseItems[appFolderOption.label]))
                .map((appFolderOption) => {
                    let treeOption: TreeOption

                    if (appFolderOption.isLeaf) {
                        const item = baseItems[appFolderOption.label]

                        if (item) {
                            treeOption = baseTreeSchema(item, openControl)
                        }
                    } else {
                        if (appFolderOption?.label) {
                            treeOption = baseFolderTreeSchema(appFolderOption.label)
                            treeOption.children = treeOption.children || []
                        }
                    }

                    delete baseItems[appFolderOption.label]

                    if (appFolderOption.children) {
                        treeOption.children = buildTree(appFolderOption.children)
                    }

                    return treeOption
                })
                .filter((o) => o.label)
        }

        localTree = buildTree(useAppStore().app.options[folderName] || [])

        for (const lastItem of Object.keys(baseItems)) {
            localTree.push(baseTreeSchema(baseItems[lastItem], openControl))
        }

        return localTree
    }

    return {
        baseFolderTreeSchema,
        baseFlowTreeSchema,
        baseParamTreeSchema,
        baseChildren,
        removeRenderSwitcherIcon,
        handleDrop,
        constructLocalTree,
        localTreeFiltered,
        updateAppFolderOptions
    }
}
