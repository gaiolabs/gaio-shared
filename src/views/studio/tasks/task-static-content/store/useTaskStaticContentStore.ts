import useDefaultReport from '@/composables/useDefaultReport'
import { useAppStore } from '@/stores'
import type { ReportNodeType } from '@gaio/shared/types'
import type { StaticContentType } from '@gaio/shared/types/tasks/static-content.type'
import { getId } from '@gaio/shared/utils'
import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useViewControlStore = defineStore('viewControl', () => {
	const showSideBar = ref(true)
	const showPreview = ref(true)
	const showPreviewModal = ref(false)

	const toggleShowSideBar = () => (showSideBar.value = !showSideBar.value)
	const toggleShowPreview = () => (showPreview.value = !showPreview.value)
	const toggleShowPreviewModal = () => (showPreviewModal.value = !showPreviewModal.value)

	const sideBarSize = ref(16)
	const previewSize = ref(42)
	const codeFrameSize = ref(42)

	watch([showSideBar, showPreview], ([newShowSideBar, newShowPreview]) => {
		sideBarSize.value = newShowSideBar ? 16 : 0
		previewSize.value = newShowPreview ? 42 : 0
		codeFrameSize.value = 100 - sideBarSize.value - previewSize.value
	})

	return {
		showSideBar,
		previewSize,
		showPreview,
		sideBarSize,
		codeFrameSize,
		showPreviewModal,
		toggleShowSideBar,
		toggleShowPreview,
		toggleShowPreviewModal,
	}
})

export const useCodeDataStore = defineStore('codeData', () => {
	const localTask = ref<StaticContentType>()

	const init = () => {
		useCodeDataStore().localTask = cloneDeep(
			useDefaultReport({
				type: 'report',
				reportType: useAppStore().cloneTask()?.reportType || 'staticContent',
				...useAppStore().cloneTask()?.project,
				base: {
					...useAppStore().appInfo,
					...useAppStore().cloneTask(),
					id: useAppStore().cloneTask().type !== 'report' ? getId() : useAppStore().cloneTask()?.id,
				} as ReportNodeType,
			}),
		)
	}

	const resetStore = () => {
		localTask.value = {}
	}

	return { localTask, init, resetStore }
})
