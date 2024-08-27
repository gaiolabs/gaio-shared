<template>
    <div v-if="localTask"
        class="sidebar-sub-nav core-shadow-2 absolute bottom-[10px] left-1/2 z-20 flex h-[40px] -translate-x-1/2 transform items-center gap-3 whitespace-nowrap rounded-[10px] border-elevation-2 bg-elevation-1 px-3">
        <div class="flex items-center gap-1">
            <g-icon name="task" />
            <span class="font-bold">
                {{ localTask.label }}
            </span>
        </div>
        <n-divider class="!m-0" vertical />

        <template v-if="isBucketTable">
            <template v-if="localInfo.tableDescribe.exists">
                <div>{{ defaultFormatNumeric(localInfo.tableDescribe.totalRows || 0) }} Rows</div>
                <div>{{ defaultFormatNumeric(localInfo.tableDescribe.totalColumns) }} Columns</div>
            </template>
            <template v-else>
                <div>{{ $t('missingTable') }}</div>
            </template>
            <n-divider class="!m-0" vertical />
        </template>
        <div v-if="showWhenTaskIs(['table'])">
            <n-button secondary size="tiny">
                <template #icon>
                    <g-icon name="table" />
                </template>
                <div>
                    {{ $t('table') }}
                </div>
            </n-button>
        </div>
        <div v-if="showWhenTaskIs(['table'])">
            <n-button secondary size="tiny">
                <template #icon>
                    <g-icon name="builder" />
                </template>
                <div>
                    {{ $t('builder') }}
                </div>
            </n-button>
        </div>
        <div v-if="showWhenTaskIs(['table'])">
            <n-button secondary size="tiny" @click="selectAction('report')">
                <template #icon>
                    <g-icon name="report" />
                </template>
                <div>
                    {{ $t('report') }}
                </div>
            </n-button>
        </div>
        <div class="text-red-600">
            <n-button text status="danger" size="tiny">
                <template #icon>
                    <g-icon name="delete" />
                </template>
                <div>
                    {{ $t('delete') }}
                </div>
            </n-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { TaskType } from '@gaio/shared/types'
import { ref, watch } from 'vue'

import useApi from '@/composables/useApi'
import useFormatValue from '@/composables/useFormatValue'
import { useAppStore } from '@/stores'

type TableDescribeType = {
    exists: boolean
    totalRows: number
    totalColumns: number
}

const { defaultFormatNumeric } = useFormatValue()

const emit = defineEmits(['choose'])
const props = defineProps<{ isBucketTable: boolean }>()

const localTask = ref<TaskType>()
const localInfo = ref({
    tableDescribe: {} as TableDescribeType
})

const showWhenTaskIs = (list = ['all']) => {
    if (list.includes('all')) return true
    return list.includes(localTask.value.type as string)
}

const selectAction = (action: string) => {
    emit('choose', {
        type: action
    })
}

const loadTableDescribe = async () => {
    if (!props.isBucketTable) return

    localInfo.value.tableDescribe = await useApi().post('api/table/describe', {
        body: {
            taskData: localTask.value
        }
    })
}

watch(
    () => useAppStore().task,
    (task) => {
        localTask.value = task
        loadTableDescribe()
    },
    {
        immediate: true
    }
)
</script>
