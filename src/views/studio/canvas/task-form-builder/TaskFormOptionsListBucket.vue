<template>
    <div class="task-form-options-list-bucket mt-2">
        <!--        <div class="control-label">-->
        <!--            <div class="control-label">{{ $t('app') }}</div>-->
        <!--            <n-select-->
        <!--                v-model="useFormStore().currentField.bucketDatabase"-->
        <!--                filterable-->
        <!--                :options="apps"-->
        <!--            />-->
        <!--        </div>-->
        <div class="control">
            <div class="flex items-center justify-between">
                <div class="control-label">{{ $t('table') }}</div>
                <g-view-table v-if="useFormStore().currentField.bucketTable"
                    :table-name="useFormStore().currentField.bucketTable" />
            </div>
            <g-select-table v-model="useFormStore().currentField.bucketTable" @change="clearFields" />
        </div>
        <template v-if="useFormStore().currentField.bucketTable">
            <div class="control">
                <div class="control-label">
                    {{ $t('value') }}
                </div>
                <g-select-column :key="useFormStore().currentField.bucketTable"
                    v-model="useFormStore().currentField.bucketFieldValue"
                    :table-name="useFormStore().currentField.bucketTable" />
            </div>

            <div class="control">
                <div class="control-label">
                    {{ $t('label') }}
                </div>
                <g-select-column :key="useFormStore().currentField.bucketTable"
                    v-model="useFormStore().currentField.bucketFieldLabel"
                    :table-name="useFormStore().currentField.bucketTable" />
            </div>

            <div class="control">
                <div class="control-label">{{ $t('order') }}</div>
                <n-select v-model:value="useFormStore().currentField.bucketFieldOrder" filterable :options="[
                    { label: $t('none'), value: undefined },
                    { label: $t('asc'), value: 'asc' },
                    { label: $t('desc'), value: 'desc' }
                ]" />
            </div>
            <div class="control">
                <div class="control-label">
                    {{ $t('rows') }}
                </div>
                <n-input-number v-model:value="useFormStore().currentField.bucketFieldLimit" :min="1" :step="1" />
            </div>
            <div class="control">
                <n-button block class="w-full" type="primary" @click="refreshInputsWithList()">
                    {{ $t('load') }}
                </n-button>
            </div>
            <div class="control">
                <g-alert show-icon :title="$t('remoteFilterWarning')" />
            </div>
        </template>
        <div class="bg-transparent p-0">
            <!--            <el-dialog-->
            <!--                destroy-on-close-->
            <!--                :title="currentTable.tableName"-->
            <!--                v-model="showTable"-->
            <!--                width="95%"-->
            <!--                :fullscreen="fullscreen"-->
            <!--                @close="$store.commit('shortkey/SET_CURRENT', 'page')"-->
            <!--            >-->
            <!--                <table-view-list-->
            <!--                    :task="currentTable.task"-->
            <!--                    :columns="fields"-->
            <!--                    :counting="currentTable.counting"-->
            <!--                    :rows="currentTable.rows"-->
            <!--                    :key="currentTable.tableName"-->
            <!--                    class="fade-in table-responsive"-->
            <!--                />-->

            <!--                <template #footer>-->
            <!--                    <div-->
            <!--                        class="el-cursor"-->
            <!--                        @click="fullscreen = !fullscreen"-->
            <!--                    >-->
            <!--                        <g-icon name="g-fullscreen" />-->
            <!--                    </div>-->
            <!--                </template>-->
            <!--            </el-dialog>-->
        </div>
    </div>
</template>

<script setup lang="ts">
import { getId } from '@gaio/shared/utils'

import GViewTable from '@/components/GViewTable.vue'
import { useFormStore } from '@/stores'

const refreshInputsWithList = () => {
    useFormStore().refreshKey = getId()
}

const clearFields = () => {
    useFormStore().currentField.bucketFieldLabel = ''
    useFormStore().currentField.bucketFieldLimit = 1000
    useFormStore().currentField.bucketFieldValue = ''
    useFormStore().currentField.bucketFieldOrder = undefined
}
</script>
