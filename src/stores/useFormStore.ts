import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { FormFieldType, FormType } from '@gaio/types'
import { cloneDeep } from 'lodash-es'
import { getId } from '@gaio/utils'

export const useFormStore = defineStore('form', () => {
    const current = ref<FormType>()
    const refreshKey = ref<string>('any')
    const currentField = ref<FormFieldType>()

    const selectFieldById = (id: string) => {
        current.value.formElements.forEach((element, elementIndex) => {
            for (const key in element.cols) {
                element.cols[key].forEach((field, fIndex) => {
                    if (field.id === id) {
                        currentField.value = current.value.formElements[elementIndex].cols[key][fIndex]
                    }
                })
            }
        })
    }

    const updateFieldById = (id: string) => {
        current.value.formElements.forEach((element, elementIndex) => {
            for (const key in element.cols) {
                element.cols[key].forEach((f, fIndex) => {
                    if (f.id === id) {
                        current.value.formElements[elementIndex].cols[key][fIndex] = cloneDeep(currentField.value)
                    }
                })
            }
        })
    }

    const deleteFieldById = (id: string) => {
        current.value.formElements.forEach((element) => {
            for (const key in element.cols) {
                element.cols[key] = element.cols[key].filter((f) => f.id !== id)
            }
        })
    }

    const refresh = () => (refreshKey.value = getId())

    return {
        current,
        refreshKey,
        currentField,
        selectFieldById,
        updateFieldById,
        deleteFieldById,
        refresh
    }
})
