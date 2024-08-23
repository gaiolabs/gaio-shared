<template>
    <div class="sidebar-source flex h-[100%] flex-col items-stretch pt-3">
        <div class="flex w-full items-stretch justify-between px-4">
            <div class="text-lg font-bold">{{ $t('sources') }}</div>
        </div>
        <div class="my-3 flex grow flex-col items-stretch overflow-hidden">
            <div class="mx-3">
                <n-collapse @item-header-click="loadMetadata">
                    <n-collapse-item
                        v-for="source in sourceList"
                        :key="source.sourceName"
                        :title="source.sourceName"
                        :name="source.sourceName"
                    >
                        <div class="mx-3">
                            <n-input
                                v-model:value="searchTerm[source.sourceName]"
                                :placeholder="$t('search')"
                                clearable
                            />
                            <n-scrollbar style="max-height: 200px">
                                <vue-draggable
                                    :key="source.items?.length"
                                    :model-value="filterBy(source.items, 'tableName', searchTerm[source.sourceName])"
                                    :sort="false"
                                    :group="{ name: 'sources', pull: 'clone', put: false }"
                                    class="drag-table"
                                >
                                    <div
                                        v-for="tb of filterBy(source.items, 'tableName', searchTerm[source.sourceName])"
                                        :key="tb.tableName"
                                        class="flex items-center border-b py-1 last-of-type:border-0"
                                    >
                                        <div class="flex-grow truncate">{{ tb.tableName }}</div>
                                        <div
                                            v-if="tb.sourceType === 'bucket'"
                                            class="drag-hide"
                                        >
                                            <g-icon
                                                name="delete"
                                                color="#e32"
                                            />
                                        </div>
                                    </div>
                                </vue-draggable>
                            </n-scrollbar>
                        </div>
                    </n-collapse-item>
                </n-collapse>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { FieldType, SourceType, TableType } from '@gaio/types'
import { onMounted, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

import useApi from '@/composables/useApi'
import useHelper from '@/composables/useHelper'
import { useAppStore } from '@/stores'

const { filterBy } = useHelper()

type SourceCollapseType = Partial<{
    name: string
    sourceName: string
    sourceTitle: string
    expanded: boolean
    items: FieldType[]
}> &
    Partial<SourceType> &
    Partial<TableType>

const sourceList = ref<SourceCollapseType[]>([])
const searchTerm = ref({})

const loadMetadata = (item: SourceCollapseType) => {
    if (!item.expanded) return
    const findSourceIndex = sourceList.value.findIndex((source) => source.sourceName === item.name)

    useApi()
        .post('api/table/list', {
            body: {
                taskData: {
                    ...useAppStore().appInfo,
                    ...sourceList.value[findSourceIndex]
                }
            }
        })
        .then((res) => (sourceList.value[findSourceIndex].items = res.data))
}

onMounted(() => {
    sourceList.value = useAppStore().sourceList.map((source) => {
        return {
            ...source,
            sourceTitle: source.sourceName.split('_').join(' ')
        } as SourceCollapseType
    })
})
</script>
