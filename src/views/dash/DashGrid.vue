<template>
    <div v-if="layout.length" class="dash-grid flex justify-center">
        <div class="h-full w-full" :style="gridOptions.viewPortSize">
            <GridLayout v-if="layout.length" v-model:layout="layout" :row-height="1" :col-num="64"
                :touch-action="gridOptions.editGrid ? 'none' : 'auto'" :is-draggable="gridOptions.editGrid"
                :is-resizable="gridOptions.editGrid">
                <grid-item v-for="item in layout" :key="item.i" :x="item.x" :y="item.y" :w="item.w" :h="item.h"
                    :i="item.i" @moved="saveFlowGrid" @resized="saveFlowGrid">
                    <report-node :task="{
                        ...item.data,
                        height: (item.h + 1.6) * 10
                    } as ReportNodeType
                        " @trigger="$emit('trigger', $event)" />
                </grid-item>
            </GridLayout>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { FlowType, NodeType, ReportNodeType, TaskType } from '@gaio/shared/types'
import { GridItem, GridLayout } from 'grid-layout-plus'
import { cloneDeep, omit } from 'lodash-es'
import { onMounted, ref, watch } from 'vue'

import useFlow from '@/composables/useFlow'
import type { GridOptionsType } from '@/views/dash/DashTypes'
import ReportNode from '@/views/report/ReportNode.vue'

type LayoutGrid = {
    x: number
    y: number
    w: number
    h: number
    i: string
    static: boolean
    data: TaskType
}

defineEmits(['trigger'])
const props = defineProps<{
    currentFlow: FlowType
    isPreviewPage: boolean
    gridOptions: GridOptionsType
}>()

const localFlow = ref()
const viewLayouts = { lg: [], md: [], sm: [] }
const layout = ref<LayoutGrid[]>([])

watch(
    () => props.gridOptions.currentLayout,
    () => generateLayout()
)

watch(
    () => props.gridOptions.refreshLayoutKey,
    () => generateLayout()
)

const generateLayout = () => {
    const workflow = localFlow.value.workflow
    layout.value = workflow.nodes
        .filter((o: NodeType) => o.type === 'report' && !o.layout?.[props.gridOptions.currentLayout]?.hidden)
        .map((node: NodeType) => {
            return {
                x: node.layout?.[props.gridOptions.currentLayout]?.x || 0,
                y: node.layout?.[props.gridOptions.currentLayout]?.y || 0,
                w:
                    node.layout?.[props.gridOptions.currentLayout]?.w >= 0 ?
                        node.layout?.[props.gridOptions.currentLayout]?.w
                        : 2,
                h: node.layout?.[props.gridOptions.currentLayout]?.h || 4,
                i: node.id,
                static: false,
                data: node
            }
        })
}

const saveFlowGrid = () => {
    const baseNodes = cloneDeep<NodeType[]>(layout.value)
    const flow = cloneDeep(localFlow.value)
    for (let node of baseNodes) {
        const nodeGrid = {
            x: node.x,
            y: node.y,
            w: node.w,
            h: node.h,
            hidden: !!node.hidden
        }
        node = node.data
        flow.workflow.nodes = flow.workflow.nodes.map((newNode: NodeType) => {
            if (newNode.id === node.id) {
                newNode.layout = newNode.layout || {}
                newNode.layout[props.gridOptions.currentLayout] = nodeGrid

                newNode.grid = nodeGrid

                // newNode.height = node.height
                // newNode.layout[props.gridOptions.currentLayout].height = node.height
                // newNode.width = node.width
            }
            return omit(newNode, ['x', 'y', 'w', 'h', 'i', 'hidden'])
        })
    }

    viewLayouts[props.gridOptions.currentLayout] = layout.value.map((o) => {
        return {
            x: o.x,
            y: o.y,
            h: o.h,
            i: `${localFlow.value.flowId}${o.i}`,
            w: o.w
        }
    })

    flow.noRollback = true
    useFlow(flow.workflow).save()
}

onMounted(() => {
    localFlow.value = props.currentFlow
    generateLayout()
})
</script>

<style lang="scss">
.dash-view {
    .vgl-item {
        border: 1px solid transparent;
    }

    .vgl-item--resizing {
        opacity: 90%;
    }
}

.dash-edit {
    .vgl-item:not(.vgl-item--placeholder) {
        border: 1px solid black;
        border-radius: 4px;
    }
}

.vgl-item--transform {
    transition-property: none;
}
</style>
