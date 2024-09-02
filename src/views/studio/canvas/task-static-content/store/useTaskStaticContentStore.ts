import { defineStore } from 'pinia'

export const useTaskStaticContentStore = defineStore('viewControl', {
	state: () => ({
		showSideBar: true,
		showPreview: true,
		showPreviewModal: false,
		showDrawer: false
	}),
	actions: {
		toggleShowSideBar() {
			this.showSideBar = !this.showSideBar
		},
		toggleShowPreview() {
			this.showPreview = !this.showPreview
		},
		toggleShowPreviewModal() {
			this.showPreviewModal = !this.showPreviewModal
		}
	}
})
