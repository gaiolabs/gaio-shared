<template>
    <g-dialog
        width="500px"
        @close="$emit('close')"
    >
        <template #title>{{ $t('repository') }}</template>
        <template #content>
            <n-spin
                size="small"
                :show="loading"
            >
                <div class="overflow-auto">
                    <div class="modal-body">
                        <div class="control">
                            <div class="control-label">
                                {{ $t('name') }}
                            </div>
                            <n-input v-model:value="source.repoName" />
                        </div>

                        <n-divider title-placement="left">
                            {{ $t('credentials') }}
                        </n-divider>

                        <div class="control">
                            <div class="control-label">
                                {{ $t('host') }}
                            </div>
                            <n-input v-model:value="source.credentials.host" />
                        </div>

                        <div class="flex gap-2">
                            <div class="control grow">
                                <div class="control-label">
                                    {{ $t('HTMLInterface') }}
                                </div>
                                <n-input-number v-model:value="source.credentials.port" />
                            </div>
                            <div class="control grow">
                                <div class="control-label">
                                    {{ $t('TCP') }}
                                    {{ $t('port') }}
                                </div>
                                <n-input-number v-model:value="source.credentials.extraPort" />
                            </div>
                        </div>
                        <div class="control">
                            <div class="control-label">
                                {{ $t('user') }}
                            </div>
                            <n-input v-model:value="source.credentials.user" />
                        </div>
                        <div class="control">
                            <div class="control-label">
                                {{ $t('password') }}
                            </div>
                            <n-input
                                v-model:value="source.credentials.password"
                                show-password
                            ></n-input>
                        </div>
                    </div>
                </div>
                <!-- FOOTER -->
                <div class="bg-paper-100 px-4 py-2 dark:bg-carbon-200">
                    <div class="flex items-center justify-between gap-2">
                        <div
                            v-if="source.repoId"
                            class="flex items-center gap-2"
                        >
                            <n-popconfirm
                                :positive-text="$t('delete')"
                                :negative-text="$t('cancel')"
                                @positive-click="remove()"
                            >
                                <template #activator>
                                    <n-button
                                        quaternary
                                        type="error"
                                    >
                                        {{ $t('remove') }}
                                    </n-button>
                                </template>
                                {{ $t('deleteSource') }}
                            </n-popconfirm>
                        </div>
                        <div></div>
                        <n-button
                            type="primary"
                            @click="saveRepo"
                        >
                            {{ $t('save') }}
                        </n-button>
                    </div>
                </div>
            </n-spin>
        </template>
    </g-dialog>
</template>

<script setup lang="ts">
import type { SourceType } from '@gaio/types'
import { onBeforeMount, ref } from 'vue'
import useApi from '@/composables/useApi'
import { cloneDeep } from 'lodash-es'

const emit = defineEmits(['close', 'save'])
const props = defineProps<{ current: SourceType }>()
const source = ref<SourceType>({ client: 'clickhouse', credentials: { port: 8123, extraPort: 9000 } })
const loading = ref(false)

const remove = async () => {
    loading.value = true
    await useApi().post('api/repo/delete', {
        body: {
            repoId: source.value.repoId
        }
    })
    emit('save')
}

const saveRepo = async () => {
    loading.value = true
    await useApi().post('api/repo/save', {
        body: {
            repoData: source.value
        }
    })
    emit('save')
}

const listSourceData = async () => {
    loading.value = true
    return useApi()
        .get('api/repo/data/' + source.value.repoId)
        .then((res) => {
            source.value.credentials = res
            loading.value = false
        })
}

onBeforeMount(async () => {
    source.value = cloneDeep(props.current)

    if (source.value.repoId) {
        await listSourceData()
    }
})
</script>
