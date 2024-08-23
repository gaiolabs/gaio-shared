<template>
    <div
        v-if="useFormStore().current?.formElements"
        class="task-form-preview mt-2"
    >
        <div class="mb-1 flex items-center justify-end">
            <n-button
                text
                size="small"
                @click="edit = !edit"
            >
                <template #icon>
                    <g-icon name="editLayout" />
                </template>
            </n-button>
        </div>
        <div
            v-if="useFormStore().current"
            class="rounded bg-paper-100 p-2 py-2 dark:bg-carbon-100"
        >
            <report-form-grid
                :form-data="useFormStore().current"
                :edit="edit"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { onBeforeMount, ref } from 'vue'

import { useFormStore } from '@/stores'
import ReportFormGrid from '@/views/report/report-form/ReportFormGrid.vue'

const edit = ref(true)

onBeforeMount(() => {
    useFormStore().current = cloneDeep(useFormStore().current)
})
</script>
