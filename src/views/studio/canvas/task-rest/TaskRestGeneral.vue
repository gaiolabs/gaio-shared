<template>
    <div v-if="localTask" class="task-rest-general flex size-full flex-col gap-6 p-6">
        <div class="flex w-full gap-1">
            <div class="w-full">
                <label class="control-label" for="endpoint">
                    {{ $t('endpoint') }}
                </label>
                <n-input id="endpoint" v-model:value="localTask.url" />
            </div>
            <div class="w-[180px]">
                <label class="control-label" for="method">
                    {{ $t('method') }}
                </label>
                <n-select id="method" v-model:value="localTask.method" :options="restMethods" />
            </div>
            <!--            <div class="w-1/2">-->
            <!--                <label-->
            <!--                    class="control-label"-->
            <!--                    for="times"-->
            <!--                >-->
            <!--                    {{ $t('times') }}-->
            <!--                </label>-->
            <!--                <n-input-number-->
            <!--                    id="times"-->
            <!--                    v-model:value="times"-->
            <!--                />-->
            <!--            </div>-->
            <div class="flex grow items-end">
                <n-button @click="runTest">
                    {{ $t('runTest') }}
                </n-button>
            </div>
        </div>
        <p>{{ `You can use parameters in the URL. Ex.: https://restsite.com/?field={\{param}\}` }}</p>
    </div>
</template>
<script setup lang="ts">
import type { RestTaskType } from '@gaio/shared/types'
import { ref } from 'vue'
import useApi from '@/composables/useApi'

// const times = ref(1)

async function runTest() {
    // until we use it
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await useApi().post('api/task/test-rest', {
        body: {
            url: localTask.url,
            method: localTask.method,
            data: localTask.body,
            headers: Object.fromEntries(localTask.headers.map(({ prop, value }) => [prop, value]))
        }
    })
}

const restMethods = ref([
    {
        label: 'GET',
        value: 'GET'
    },
    {
        label: 'POST',
        value: 'POST'
    },
    {
        label: 'PUT',
        value: 'PUT'
    },
    {
        label: 'DELETE',
        value: 'DELETE'
    }
])

const { localTask } = withDefaults(defineProps<{ localTask: RestTaskType }>(), {
    localTask: null
})
</script>
