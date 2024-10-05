import { defineStore } from 'pinia'

export const useDebugModeStore = defineStore('debugMode', {
	state: () => ({
		isActive: false,
	}),
	actions: {
		toggleDebugMode() {
			this.isActive = !this.isActive
		},
	},
})
