<template>
    <div class="tag-resource ms-1">
        <div ref="main" class="g-bg-1 card-header-fix card-tags rounded shadow">
            <div class="card-header g-bg-400 flex items-center justify-between p-2">
                {{ $t('resourceTo') }}
                <div class="flex items-center justify-end gap-2">
                    <n-button size="tiny" quaternary @click="changeAllEditView()">
                        <template #icon>
                            <g-icon :name="toggleEditViewIcon" />
                        </template>
                    </n-button>
                    <n-button size="tiny" quaternary @click="useTagStore().resourceTags = []">
                        <template #icon>
                            <g-icon name="eraser" />
                        </template>
                    </n-button>
                </div>
            </div>
            <n-scrollbar :style="{ height: '100%' }">
                <n-tag v-for="(item, index) in useTagStore().resourceTags" :key="index" type="success" size="small"
                    class="m-1" closable @close="remove(item)">
                    <div class="flex items-center gap-1">
                        <div v-if="item.type === 'app'" @click="changeTagRole(item)">
                            <g-icon :name="item.role === 'edit' ? 'edit' : 'eye'" />
                        </div>
                        <div v-if="item.type === 'source'">
                            <g-icon name="database" />
                        </div>
                        <div class="tag-inner" style="flex-grow: 1">
                            {{ item.name }} {{ item.role }}
                        </div>
                    </div>
                </n-tag>
            </n-scrollbar>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { TagTypePermission } from '@gaio/shared/types'
import { getId } from '@gaio/shared/utils'
import { cloneDeep } from 'lodash-es'
import { computed, ref } from 'vue'

import { useTagStore } from '@/stores'

const localKey = ref('any')
const toggleEditView = ref('view')

const toggleEditViewIcon = computed(() => {
    return toggleEditView.value === 'edit' ? 'eye' : 'edit'
})

const changeAllEditView = () => {
    toggleEditView.value = toggleEditView.value === 'edit' ? 'view' : 'edit'

    const resourcesTags = cloneDeep(useTagStore().resourceTags)

    resourcesTags.forEach((t) => {
        t.role = toggleEditView.value
    })

    useTagStore().resourceTags = Object.assign([], resourcesTags)

    localKey.value = getId(6)
}

const changeTagRole = (item: TagTypePermission) => {
    useTagStore().resourceTags.forEach((t) => {
        if (t.refId === item.refId && item.type === t.type) {
            if (t.role === 'view') {
                t.role = 'edit'
            } else {
                t.role = 'view'
            }
        }
    })
    localKey.value = getId(6)
}

const remove = (tag: TagTypePermission) => {
    useTagStore().resourceTags = useTagStore().resourceTags.filter((o) => o !== tag)
}
</script>
