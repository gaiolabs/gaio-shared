import { useAppStore } from '@/stores'
import type { FieldType, TaskType } from '@gaio/shared/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useColumnView = defineStore('column', () => {
	const columnData = ref<FieldType>({
		min: 0,
		max: 0
	})
	const totalRows = ref<number>(0)
	const localTask = computed<TaskType>(() => useAppStore().task)

	const defineColumnView = (col: FieldType, rows: number) => {
		columnData.value = col
		totalRows.value = rows
	}

	return {
		defineColumnView,
		localTask,
		columnData,
		totalRows
	}
})
