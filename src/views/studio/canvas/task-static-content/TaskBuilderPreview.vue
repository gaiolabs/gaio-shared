<template>
    <div class="task-builder-preview flex h-full w-full flex-shrink flex-col overflow-y-auto p-2 pb-4">
        <template v-if="errorData?.message">
            <n-alert type="error" class="mb-3">
                {{ errorData.message }}
            </n-alert>
            <code-editor :key="errorData.query" v-model="errorData.query" class="h-full w-full grow" readonly />
        </template>
        <n-data-table v-else-if="columns?.length" size="small" fixed-header :max-height="350" :columns="columns"
            :data="result" />
    </div>
</template>
<script setup lang="ts">
import type { BuilderTaskType } from '@gaio/shared/types'
import { onMounted, ref } from 'vue'
import useApi from '@/composables/useApi'
import { cloneDeep } from 'lodash-es'
import { format as sqlFormatter } from 'sql-formatter'

const props = defineProps<{ localTask: BuilderTaskType }>()
const result = ref({})

const columns = ref([])
const errorData = ref({
    message: '',
    query: ''
})

onMounted(async () => {
    errorData.value.message = ''
    const taskData = cloneDeep(props.localTask)
    taskData.schema.limit = 10

    const { message, query, meta, data } = await useApi().post('api/table/rows', {
        body: {
            taskData,
            params: []
        }
    })

    if (message) {
        errorData.value.message = message
        errorData.value.query = sqlFormatter(query)
        return
    }

    columns.value = meta.map((column) => ({
        title: column.name,
        key: column.name,
        dataIndex: column.name
    }))

    result.value = data
})
</script>
