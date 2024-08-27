import type { BuilderTaskType, SchemaFilterType } from '@gaio/shared/types'
import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTableStore = defineStore(
    'table',
    () => {
        const localFilter = ref<{ [key: string]: SchemaFilterType[] }>({})

        const getFilter = (task: BuilderTaskType) =>
            cloneDeep(
                localFilter.value[task.tableName + task.databaseName + task.client + task.sourceType] || [
                    {
                        operator: '=',
                        list: [],
                        andOr: 'and'
                    }
                ]
            )

        const defineFilter = (task: BuilderTaskType, filter: SchemaFilterType[]) => {
            localFilter.value[task.tableName + task.databaseName + task.client + task.sourceType] = cloneDeep(filter)
        }

        const resetFilter = (task: BuilderTaskType) => {
            localFilter.value[task.tableName + task.databaseName + task.client + task.sourceType] = [
                {
                    operator: '=',
                    list: [],
                    andOr: 'and'
                }
            ]
        }

        const reset = () => {
            localFilter.value = {}
        }

        return { defineFilter, getFilter, localFilter, resetFilter, reset }
    },
    {
        persist: { paths: ['localFilter'] }
    }
)
