<template>
    <g-dialog width="500px" @close="$emit('close')">
        <template #title>{{ $t('source') }}</template>
        <template #content>
            <n-spin size="small" :show="loading">
                <div class="overflow-auto">
                    <div class="control grow">
                        <div class="control-label">{{ $t('client') }}</div>
                        <n-select v-model:value="source.client" default-value="mysql" filterable :options="[
                            { value: 'mysql', label: 'MySQL' },
                            { value: 'clickhouse', label: 'Clickhouse' },
                            { value: 'memsql', label: 'MemSQL' },
                            { value: 'mariadb', label: 'MariaDB' },
                            { value: 'mssql', label: 'SQL Server' },
                            { value: 'pg', label: 'PostgreSQL' },
                            { value: 'redshift', label: 'Redshift' },
                            { value: 'oracle', label: 'Oracle' },
                            { value: 'salesforce', label: 'Salesforce' },
                            { value: 's3', label: 'S3 AWS' }
                        ]" @update:value="controlClient()" />
                    </div>
                    <div class="control grow">
                        <div class="control-label">
                            {{ $t('label') }}
                        </div>
                        <n-input v-model:value="source.sourceName" />
                    </div>
                    <n-divider title-placement="left">
                        {{ $t('credentials') }}
                    </n-divider>
                    <div v-if="source.client !== 's3'">
                        <template v-if="source.client === 'salesforce'">
                            <div>
                                <div class="control">
                                    <div class="control-label">
                                        {{ $t('organizationType') }}
                                    </div>
                                    <n-select v-model:value="source.credentials.loginUrl" :options="[
                                        { value: 'https://login.salesforce.com', label: 'Production' },
                                        { value: 'https://test.salesforce.com', label: 'Sandbox' }
                                    ]" class="w-full" />
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div>
                                <div class="control">
                                    <div class="control-label">
                                        {{ $t('host') }}
                                    </div>
                                    <n-input v-model:value="source.credentials.host" />
                                </div>
                            </div>
                            <div v-if="source.client !== 'salesforce'">
                                <div class="control">
                                    <div class="control-label">
                                        {{ $t('port') }}
                                    </div>
                                    <n-input-number v-model:value="source.credentials.port" />
                                </div>
                            </div>
                        </template>
                        <div v-if="source.client !== 'salesforce'" class="control">
                            <div class="control-label">
                                {{ $t('database') }}
                            </div>
                            <n-input v-model:value="source.credentials.database" />
                        </div>
                        <div v-if="source.client === 'salesforce'" class="control">
                            <div class="control-label">Security Token</div>
                            <n-input v-model:value="source.credentials.token" />
                        </div>
                        <div v-if="source.client === 'pg'" class="control">
                            <div class="control-label">
                                {{ $t('schemaName') }}
                            </div>
                            <n-input v-model:value="source.credentials.schema" />
                        </div>
                        <div v-if="source.client === 'oracle'" class="control">
                            <div class="control-label">SID</div>
                            <n-input v-model:value="source.credentials.sid" name="sid" />
                        </div>
                        <div v-if="source.client === 'oracle'" class="control">
                            <div class="control-label">Service Name</div>
                            <n-input v-model:value="source.credentials.serviceName" name="serviceName" />
                        </div>
                        <div v-if="source.client === 'mssql'" class="control control-secondary">
                            <n-checkbox v-model:checked="source.credentials.encrypt" :label="$t('encrypt')" />
                        </div>
                        <div v-if="source.client === 'mssql'" class="control control-secondary">
                            <n-checkbox v-model:checked="source.credentials.encryptSource"
                                :label="$t('encryptSource')" />
                        </div>
                        <div v-if="source.client === 'oracle'" class="control control-secondary">
                            <n-checkbox v-model:checked="source.credentials.oracleAlternativeDriver"
                                :label="$t('oracleAlternativeDriver')" />
                        </div>
                        <div v-if="source.client === 'oracle'" class="control control-secondary">
                            <n-checkbox v-model:checked="source.credentials.oracleCaseSensitive"
                                :label="$t('oracleCaseSensitive')" />
                        </div>
                        <div class="control">
                            <div>
                                <div>
                                    <div class="control">
                                        <div class="control-label">
                                            {{ $t('user') }}
                                        </div>
                                        <n-input v-model:value="source.credentials.user" autocomplete="off"
                                            name="base" />
                                    </div>
                                </div>
                                <div>
                                    <div class="control">
                                        <div class="control-label">
                                            {{ $t('password') }}
                                        </div>
                                        <n-input v-model:value="source.credentials.password" show-password />
                                    </div>
                                </div>
                            </div>
                            <div class="control control-secondary">
                                <n-checkbox v-model:checked="source.credentials.canExecuteRaw"
                                    :label="$t('executeRawQuery')" :disabled="disableRaw" />
                            </div>
                        </div>
                    </div>
                    <div v-if="source.client === 's3'">
                        <div class="control">
                            <div class="control-label">
                                {{ $t('host') }}
                            </div>
                            <n-input v-model:value="source.credentials.host" />
                        </div>
                        <div class="control">
                            <div class="control-label">
                                {{ $t('accessKey') }}
                            </div>
                            <n-input v-model:value="source.credentials.accessKey" />
                        </div>
                        <div class="control">
                            <div class="control-label">
                                {{ $t('secretKey') }}
                            </div>
                            <n-input v-model:value="source.credentials.secretKey" />
                        </div>
                        <div class="control">
                            <div class="control-label">
                                {{ $t('bucket') }}
                            </div>
                            <n-input v-model:value="source.credentials.bucketName" />
                        </div>
                    </div>
                </div>
                <!-- FOOTER -->
                <div class="bg-paper-100 px-4 py-2 dark:bg-carbon-200">
                    <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-2">
                            <n-popconfirm :positive-text="$t('delete')" :negative-text="$t('cancel')"
                                @positive-click="remove()">
                                <template #activator>
                                    <n-button quaternary type="error">
                                        {{ $t('remove') }}
                                    </n-button>
                                </template>
                                {{ $t('deleteSource') }}
                            </n-popconfirm>
                            <n-button v-if="source.client !== 's3'" type="success" quaternary plain @click="testSource">
                                {{ $t('test') }}
                            </n-button>
                        </div>

                        <n-button type="primary" @click="saveSource">
                            {{ $t('save') }}
                        </n-button>
                    </div>
                </div>
            </n-spin>
        </template>
    </g-dialog>
</template>
<script setup lang="ts">
import type { SourceType } from '@gaio/shared/types'
import { ref, onBeforeMount } from 'vue'
import useApi from '@/composables/useApi'
import { cloneDeep } from 'lodash-es'

const emit = defineEmits(['close', 'save'])
const props = defineProps<{ current: SourceType }>()
const source = ref<SourceType>({ client: 'mysql' })
const loading = ref(false)
const disableRaw = ref(false)

const remove = async () => {
    loading.value = true
    await useApi().post('api/source/remove', {
        body: {
            sourceId: source.value.sourceId
        }
    })
    emit('save')
}

const testSource = async () => {
    loading.value = true

    await useApi().post('api/source/test', {
        body: {
            sourceData: source.value
        }
    })
}

const saveSource = async () => {
    loading.value = true

    await useApi().post('api/source/save', {
        body: {
            sourceData: source.value
        }
    })
    emit('save')
}

const controlClient = () => {
    if (source.value.client === 'salesforce') {
        source.value.credentials.canExecuteRaw = true
        disableRaw.value = true
    } else {
        disableRaw.value = false
    }
}

const listSourceData = () => {
    loading.value = true
    useApi()
        .get('api/source/data/' + source.value.sourceId)
        .then((res) => {
            source.value.credentials = res
            loading.value = false
        })
}

onBeforeMount(async () => {
    source.value = cloneDeep({
        ...props.current,
        credentials: {}
    })

    if (['salesforce'].includes(source.value.client)) {
        disableRaw.value = true
    }

    if (source.value.sourceId) {
        listSourceData()
    }
})
</script>
